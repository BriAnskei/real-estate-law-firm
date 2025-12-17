import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { CaseLogModel } from "../model/case_log.model.js";
import pool from "../config/db.js";

export class CaseLogService {
  static async create(
    payload: CaseLogModel,
    connection: PoolConnection
  ): Promise<void> {
    try {
      await connection.execute(
        `
         INSERT INTO case_logs
          (case_id, user_id, type, title, description, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          payload.case_id,
          payload.user_id,
          payload.type,
          payload.title,
          payload.description,
          payload.metadata,
        ]
      );
    } catch (error) {
      throw error;
    }
  }

  static async fetchAllByCaseId(caseId: string): Promise<CaseLogModel[]> {
    try {
      const [rows] = await pool.execute<(CaseLogModel & RowDataPacket)[]>(
        `
        SELECT * FROM case_logs WHERE case_id = ?
        ORDER BY created_at DESC
        `,
        [caseId]
      );
      return rows.map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata as any) : undefined,
      }));
    } catch (error) {
      throw error;
    }
  }
}
