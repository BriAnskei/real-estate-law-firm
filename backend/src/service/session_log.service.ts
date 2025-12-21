import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { SessionLogModel } from "../model/user_session.model.js";

export class SessionLogService {
  /**
   * Create a new session log (called on login)
   */
  static async addSession(payload: {
    userId: string;
    connection?: PoolConnection;
  }): Promise<string> {
    const { userId, connection } = payload;

    const sql = connection ?? pool;

    try {
      const [res] = await sql.execute<ResultSetHeader>(
        `
      INSERT INTO user_sessions
        (user_id)
      VALUES (?)
      `,
        [userId]
      );

      return res.insertId.toString();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch session logs with:
   * - pagination
   * - search (name or email)
   * - date range filter
   */
  static async fetchSessions(payload: {
    page?: number;
    limit?: number;
    filters?: {
      query?: string;
      startDate?: string; // yyyy-mm-dd
      endDate?: string; // yyyy-mm-dd
    };
  }): Promise<{
    page: number;
    totalPages: number;
    total: number;
    data: SessionLogModel[];
  }> {
    const { page = 1, limit = 10, filters } = payload;
    const offset = (page - 1) * limit;

    const whereParts: string[] = [];
    const params: any[] = [];

    if (filters?.query?.trim()) {
      whereParts.push(`
      (
        u.email LIKE ?
        OR u.firstName LIKE ?
        OR u.lastName LIKE ?
        OR CONCAT(u.firstName, ' ', u.lastName) LIKE ?
      )
    `);
      const q = `%${filters.query}%`;
      params.push(q, q, q, q);
    }

    // date filters
    if (filters?.startDate) {
      whereParts.push("us.loginTime >= ?");
      params.push(`${filters.startDate} 00:00:00`);
    }

    if (filters?.endDate) {
      whereParts.push("us.loginTime <= ?");
      params.push(`${filters.endDate} 23:59:59`);
    }

    const whereClause =
      whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

    // main query
    const [rows] = await pool.execute<(SessionLogModel & RowDataPacket)[]>(
      `
    SELECT
      us.id,
      us.user_id,
      CONCAT(u.firstName, ' ', u.lastName) AS fullName,
      u.email,
      u.role,
      us.loginTime,
      us.logoutTime,
      us.status
    FROM user_sessions us
    INNER JOIN users u ON u.id = us.user_id
    ${whereClause}
    ORDER BY us.loginTime DESC
    LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    const total = await this.countSessions(whereClause, params);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      data: rows,
    };
  }

  /**
   * Count total sessions (used for pagination)
   */
  private static async countSessions(
    whereClause: string,
    params: any[]
  ): Promise<number> {
    const [rows] = await pool.execute<({ total: number } & RowDataPacket)[]>(
      `
       SELECT COUNT(*) AS total
    FROM user_sessions us
    INNER JOIN users u ON u.id = us.user_id
      ${whereClause}
      `,
      params
    );

    return rows[0].total;
  }

  /**
   * Optional: mark session as ended
   */
  static async endSession(sessionId: string): Promise<void> {
    const [res] = await pool.execute(
      `
      UPDATE user_sessions
      SET logoutTime = NOW(), status = 'ended'
      WHERE id = ? AND status = 'active'
      `,
      [sessionId]
    );

    if ((res as any).affectedRows === 0) {
      throw new Error("Session not found or already ended");
    }
  }
}
