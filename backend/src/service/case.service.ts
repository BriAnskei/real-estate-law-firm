import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { CasesModel } from "../model/cases.model.js";
import { ClientModel } from "../model/clientModel.js";
import { ResponseType } from "../types/auth.types.js";
import { ClientService } from "./client.service.js";

export class CaseSerice {
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

  static async getAllNoPay(payload: {
    page?: number;
    limit?: number;
  }): Promise<{
    page: number;
    totalPages: number;
    data: CasesModel[];
    total: number;
  }> {
    const { page = 1, limit = 12 } = payload;

    try {
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
    SELECT *
    FROM cases
    WHERE paid = "no"
    ORDER BY consultation_date ASC
    LIMIT ? OFFSET ?
        `,
        [limit, offset]
      );

      const total = await this.countTotalCases({ paid: "no" });

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
    searchQuery?: string; // ex: "WHERE concern LIKE ?"
    params?: any[]; // ex: ["%land%"]
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
}
