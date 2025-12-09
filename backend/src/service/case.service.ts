import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { CasesModel } from "../model/cases.model.js";
import { ClientModel } from "../model/clientModel.js";
import { ResponseType } from "../types/auth.types.js";
import { ClientService } from "./client.service.js";
import { CaseStageService } from "./case_stage.service.js";
import { TaskService } from "./task.service.js";
import { TaskFileService } from "./task_file.service.js";
import { deleteCaseFolder } from "../util/deleteCaseFolderHandler.js";
import { TaskReviewService } from "./task_review.service.js";
import { NotificationService } from "./notification.service.js";

const CASE_STAGE_MODEL_JOIN = ` SELECT 
        c.id AS case_id,
        c.client_id as client_id,
        c.concern AS concern,
        c.description AS description,
        c.status AS status,
        c.paid AS paid,
        c.created_at AS created_at,
        c.opposing_party,
        c.consultation_date
      FROM case_stages cs
      LEFT JOIN cases c ON c.id = cs.case_id`;

export class CaseService {
  static async handleNewCase(payload: {
    caseData: CasesModel;
    clientData: ClientModel;
    userId: string;
  }): Promise<{ newCaseData: CasesModel; newClientData: ClientModel }> {
    const { caseData, clientData, userId } = payload;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const newClientId = await ClientService.addClient(clientData, connection);
      const newCaseId = await this.create(
        { ...caseData, client_id: newClientId },
        connection
      );

      await NotificationService.consultation(
        {
          related_case_id: newCaseId,
          user_Id: userId,
          case_concern: caseData.concern,
        },
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
    (client_id, client_name,   	opposing_party, concern, description, consultation_date)
  VALUES (?, ?, ?, ?, ?, ?)
  `,
        [
          newCaseData.client_id,
          newCaseData.client_name,
          newCaseData.opposing_party,
          newCaseData.concern,
          newCaseData.description,
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

  static async findById(
    id: string,
    connection?: PoolConnection
  ): Promise<ResponseType<CasesModel>> {
    try {
      const sqlPool = connection ?? pool;

      const [rows] = await sqlPool.execute<(CasesModel & RowDataPacket)[]>(
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

  /**
   * Check if case is ongoing or complete
   */
  static async isCaseActive(
    caseId: string,
    connection?: PoolConnection
  ): Promise<boolean> {
    try {
      const response = await this.findById(caseId, connection);

      if (!response.success)
        throw new Error(response.message || "Unknown error");

      return response.data!.status !== "pending";
    } catch (error) {
      console.error(error);
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

  static async getCaseDataByCaseStageId(
    case_stage_id: string
  ): Promise<CasesModel> {
    try {
      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
          ${CASE_STAGE_MODEL_JOIN} WHERE cs.id = ? 
          LIMIT 1
          `,
        [case_stage_id]
      );

      if (!rows[0]) throw new Error("Case with this stage_id does not exist");

      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * this fetches the cases under consultation(pending status)
   */
  static async fetchCases(payload: {
    page?: number;
    limit?: number;
    filters?: {
      query: string;
      sortFilter: string;
      status?: string;
    };
  }): Promise<{
    page: number;
    totalPages: number;
    data: CasesModel[];
    total: number;
  }> {
    const { page = 1, limit = 12, filters } = payload;

    const { query, sortFilter = "created_at", status = "pending" } = filters!;

    try {
      const offset = (page - 1) * limit;

      const whereParts: string[] = [];
      const params: string[] = [];

      if (query?.trim()) {
        whereParts.push("(client_name LIKE ? OR concern LIKE ?)");
        params.push(`%${query}%`, `%${query}%`);
      }

      if (status) {
        whereParts.push("status = ?");
        params.push(status);
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

  static async fetchActive(): Promise<CasesModel[]> {
    try {
      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(`
      SELECT * 
      FROM cases 
      WHERE status IN ('ongoing', 'complete')
      `);

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async filterActive(payload: {
    query?: string;
    status?: string;
  }): Promise<CasesModel[]> {
    const { query, status } = payload;
    try {
      // search all to status of pending or complete
      var whereClause = "WHERE status IN ('ongoing', 'complete')";
      const params = [];

      if (query?.trim()) {
        whereClause += " AND (client_name LIKE ? OR concern LIKE ?)";
        params.push(`%${query}%`, `%${query}%`);
      }

      if (status) {
        whereClause += " AND status = ?";
        params.push(status);
      }

      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
        SELECT * FROM cases ${whereClause} 
        `,
        [...params]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * this filter is used on payment page
   * filter cases of paid = partial || paid
   */
  static async filterPayments(payload: {
    query?: string;
    paidType?: string;
  }): Promise<CasesModel[]> {
    try {
      const { query, paidType } = payload;
      if (!query && !paidType)
        throw new Error("No filter recieve to process this request");

      var whereClause = "WHERE status IN ('ongoing', 'complete')";
      const params = [];

      if (query?.trim()) {
        whereClause += " AND (client_name LIKE ? OR concern LIKE ?)";
        params.push(`%${query}%`, `%${query}%`);
      }

      if (paidType) {
        whereClause += " AND paid = ?";
        params.push(paidType);
      }

      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `
      SELECT * FROM cases ${whereClause} 
        `,
        [...params]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async fetchCaseStatus(
    id: string,
    connection?: PoolConnection
  ): Promise<"pending" | "complete" | "ongoing"> {
    try {
      const sqlConnection = connection ?? pool;

      const [rows] = await sqlConnection.execute<RowDataPacket[]>(
        `
        SELECT status FROM cases WHERE id = ? LIMIT 1
        `,
        [id]
      );

      return rows[0].status;
    } catch (error) {
      console.error(error);
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
    connection?: PoolConnection
  ) {
    try {
      const sqlPool = connection ?? pool;

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
      const [res] = await sqlPool.execute<ResultSetHeader>(query, [
        ...values,
        id,
      ]);

      if (res.affectedRows === 0) throw new Error("Case not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async markAsPaid(caseId: string): Promise<void> {
    try {
      const [row] = await pool.execute<ResultSetHeader>(
        `
        UPDATE cases SET promise_to_pay = NULL, paid = 'paid' WHERE id = ? 
        `,
        [caseId]
      );
      if (row.affectedRows === 0) throw new Error("Case not found");
    } catch (error) {
      throw error;
    }
  }

  static async updateCaseStatus(
    payload: {
      id: string;
      status: "pending" | "ongoing" | "complete";
    },
    connection: PoolConnection
  ): Promise<void> {
    const { id, status } = payload;
    try {
      const [rows] = await connection.execute<ResultSetHeader>(
        `
        UPDATE cases SET status = ? WHERE id = ?
        `,
        [status, id]
      );

      if (rows.affectedRows === 0) throw new Error("Case not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async setCaseAsOngiong(payload: {
    id: string;
    paymentMode: string;
    promiseToPay?: Date;
  }) {
    const connection = await pool.getConnection();
    try {
      await this.setPayment(payload, connection);
      await this.updateCaseStatus(
        { id: payload.id, status: "ongoing" },
        connection
      );

      // stages
      await CaseStageService.create(payload.id, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("Error updating case:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  private static async setPayment(
    payload: {
      id: string;
      paymentMode: string;
      promiseToPay?: Date;
    },
    connection: PoolConnection
  ): Promise<void> {
    const { id, paymentMode, promiseToPay } = payload;

    const updates = [];
    const values = [];

    if (paymentMode === "partial") {
      updates.push("promise_to_pay = ?");
      values.push(promiseToPay);
    }

    updates.push("paid = ?");
    values.push(paymentMode);

    values.push(id);

    const query = `
    UPDATE cases 
    SET ${updates.join(", ")} 
    WHERE id = ?
  `;

    try {
      const [rows] = await connection.execute<ResultSetHeader>(query, values);
      if (rows.affectedRows === 0) throw new Error("Case not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async processCaseDeletion(id: string): Promise<void> {
    try {
      const caseStatus = await this.fetchCaseStatus(id);

      if (caseStatus === "pending") {
        await this.deleteCaseById(id);
      } else {
        await this.deleteActiveCase(id);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteCaseById(
    id: string,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const sqlConnection = connection ?? pool;
      const [res] = await sqlConnection.execute<ResultSetHeader>(
        `
        DELETE FROM cases WHERE id = ?
        `,
        [id]
      );

      if (res.affectedRows === 0) throw new Error("Case not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * deletes all the related data for this case
   */
  static async deleteActiveCase(id: string): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await TaskReviewService.deleteByCaseId(id, connection);
      await TaskFileService.deleteAllByCaseId(id, connection);
      await TaskService.deleteAllByCaseId(id, connection);
      await CaseStageService.deleteAllByCaseId(id, connection);
      await this.deleteCaseById(id, connection);

      await deleteCaseFolder(id);

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
