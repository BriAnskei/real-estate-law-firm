import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { CaseLogModel } from "../model/case_log.model.js";
import pool from "../config/db.js";
import { Roles } from "../model/registration_request.model.js";

export class CaseLogService {
  static async create(
    payload: CaseLogModel,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const hasMetadata = payload.metadata !== undefined;

      const sql = `
      INSERT INTO case_logs
        (case_id, user_id, type, title, description${
          hasMetadata ? ", metadata" : ""
        })
      VALUES (?, ?, ?, ?, ?${hasMetadata ? ", ?" : ""})
    `;

      const values = [
        payload.case_id,
        payload.user_id,
        payload.type,
        payload.title,
        payload.description ?? null,
        ...(hasMetadata ? [JSON.stringify(payload.metadata)] : []),
      ];

      await connection.execute(sql, values);
    } catch (error) {
      throw error;
    }
  }

  static async fetchAllByCaseId(
    caseId: string
  ): Promise<(CaseLogModel & { user_name: string; role: Roles })[]> {
    try {
      const [rows] = await pool.execute<
        ((CaseLogModel & { user_name: string; role: Roles }) & RowDataPacket)[]
      >(
        `
    SELECT
  cl.id,
  cl.case_id,
  cl.type,
  cl.title,
  cl.description,
  cl.metadata,
  cl.created_at,
  CONCAT(u.firstName, ' ', u.lastName) AS user_name,
  u.role
  FROM case_logs cl
  JOIN users u ON u.id = cl.user_id
  WHERE cl.case_id = ?
  ORDER BY cl.created_at DESC;

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
