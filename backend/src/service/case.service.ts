import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { CasesModel } from "../model/cases.model.js";
import { ClientModel } from "../model/clientModel.js";
import { ResponseType } from "../types/auth.types.js";
import { ClientService } from "./client.service.js";

export class CaseService {
  static async handleNewCase(payload: {
    caseData: CasesModel;
    clientData: ClientModel;
  }): Promise<{ newCaseData: CasesModel; newClientData: ClientModel }> {
    const { caseData, clientData } = payload;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const newClientId = await ClientService.addClient(clientData, connection);
      const newCaseId = await this.create(
        { ...caseData, client_id: newClientId },
        connection
      );

      await connection.commit();
      return await this.getNewCaseData({ newCaseId, newClientId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async create(
    newCaseData: CasesModel,
    connection: PoolConnection
  ): Promise<string> {
    try {
      const [row] = await connection.execute<ResultSetHeader>(
        `
  INSERT INTO cases
    (client_id, client_name,  concern, description, paid, status, consultation_date)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
        [
          newCaseData.client_id,
          newCaseData.client_name,
          newCaseData.concern,
          newCaseData.description,
          newCaseData.paid,
          newCaseData.status,
          newCaseData.consultation_date,
        ]
      );

      return row.insertId.toString();
    } catch (error) {
      throw error;
    }
  }

  static async getNewCaseData(paylaod: {
    newCaseId: string;
    newClientId: string;
  }): Promise<{ newCaseData: CasesModel; newClientData: ClientModel }> {
    const { newCaseId, newClientId } = paylaod;

    try {
      const newCaseData = (await this.findById(newCaseId)).data!;
      const newClientData = (await ClientService.findById(newClientId)).data!;

      return { newCaseData, newClientData };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string): Promise<ResponseType<CasesModel>> {
    try {
      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
      SELECT * FROM cases WHERE id = ?
      `,
        [id]
      );

      if (!rows[0]) return { success: false, message: "case does not exist" };

      return { success: true, data: rows[0] };
    } catch (error) {
      throw error;
    }
  }

  static async findByClientId(
    clientId: string
  ): Promise<ResponseType<CasesModel>> {
    try {
      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
      SELECT * FROM cases WHERE client_id = ?
      `,
        [clientId]
      );

      if (!rows[0]) return { success: false, message: "case does not exist" };

      return { success: true, data: rows[0] };
    } catch (error) {
      throw error;
    }
  }

  /**
   * this function will be used for the consultation cases(not payment yet)
   * implemented using pagiantion control
   */
  static async fetchCases(payload: {
    page?: number;
    limit?: number;
    filters?: {
      query: string;
      sortFilter: string;
      paid?: string;
    };
  }): Promise<{
    page: number;
    totalPages: number;
    data: CasesModel[];
    total: number;
  }> {
    const { page = 1, limit = 12, filters } = payload;

    const { query, sortFilter = "created_at", paid = "no" } = filters!;

    try {
      const offset = (page - 1) * limit;

      const whereParts: string[] = [];
      const params: string[] = [];

      if (query?.trim()) {
        whereParts.push("(client_name LIKE ? OR concern LIKE ?)");
        params.push(`%${query}%`, `%${query}%`);
      }

      if (paid) {
        whereParts.push("paid = ?");
        params.push(paid);
      }

      const whereClause =
        whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";

      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
    SELECT *
    FROM cases
        ${whereClause}
    ORDER BY ${sortFilter} ${sortFilter === "created_at" ? "DESC" : "ASC"}
    LIMIT ? OFFSET ? 
        `,
        [...params, limit, offset]
      );

      const total = await this.countTotalCases({
        paid: "no",
        params,
        searchQuery: whereClause,
      });

      return {
        page,
        totalPages: Math.ceil(total / limit),
        data: rows,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  private static async countTotalCases(payload?: {
    searchQuery?: string;
    params?: any[];
    paid: "no" | "partial" | "paid";
  }): Promise<number> {
    try {
      let sql = `
      SELECT COUNT(*) AS total
      FROM cases
    `;

      const params: any[] = [];

      if (payload?.searchQuery) {
        sql += ` ${payload.searchQuery} AND paid = ?`;
        params.push(...(payload.params || []));
      } else {
        sql += ` WHERE paid = ?`;
      }

      params.push(payload!.paid!);

      const [rows] = await pool.query(sql, params);

      return (rows as any)[0].total;
    } catch (error) {
      throw error;
    }
  }

  static async handleUpdateCaseConsultation(payload: {
    caseId: string;
    caseUpdate: Partial<CasesModel>;
    clientUpdate: Partial<ClientModel>;
  }) {
    const connection = await pool.getConnection();
    try {
      const { caseId, caseUpdate, clientUpdate } = payload;

      await connection.beginTransaction();

      await this.updateCase({ id: caseId, update: caseUpdate }, connection);
      await ClientService.updateClient(
        caseUpdate.client_id!,
        clientUpdate,
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateCase(
    payload: {
      id: string;
      update: Partial<CasesModel>;
    },
    connection: PoolConnection
  ) {
    try {
      const { id, update } = payload;
      const keys = Object.keys(update).filter(
        (key) =>
          update[key as keyof typeof update] !== undefined &&
          key !== "id" &&
          key !== "created_at"
      );

      if (keys.length === 0) throw new Error("No fields to update");

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => update[key as keyof typeof update]);

      const query = `
    UPDATE cases SET ${setClause}
    WHERE id = ?
    `;
      const [res] = await connection.execute<ResultSetHeader>(query, [
        ...values,
        id,
      ]);

      if (res.affectedRows === 0) throw new Error("Case not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteCaseById(id: string): Promise<boolean> {
    try {
      const [res] = await pool.execute(
        `
        DELETE FROM cases WHERE id = ?
        `,
        [id]
      );

      return (res as any).affectedRows > 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
