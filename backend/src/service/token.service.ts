import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { refreshToken } from "../model/refreshToken.model.js";
import { ResponseType } from "../types/auth.types.js";

export class TokenService {
  static async createRefreshToken(payload: refreshToken) {
    try {
      const { token, userId, expiresAt } = payload;
      await pool.execute(
        `INSERT INTO refresh_tokens (token, userId, expiresAt)
      VALUES (?, ?, ?)`,
        [token, userId, expiresAt]
      );

      //
    } catch (error) {
      throw new Error("createRefreshToken -> " + error);
    }
  }

  /**
   * Find the token data by refreshToken
   */
  static async findByToken(token: string): Promise<ResponseType<refreshToken>> {
    try {
      const [rows] = await pool.execute<(refreshToken & RowDataPacket)[]>(
        `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`,
        [token]
      );

      if (!rows[0]) {
        return { success: false, message: "unauthorized, please login again" };
      }

      return { success: true, data: rows[0] };
    } catch (error) {
      throw new Error("findByToken -> " + error);
    }
  }

  /**
   *
   * repelce the old refrestToken, expireAt with the new refreshToken
   */
  static async refreshOldToken(payload: {
    oldToken: string;
    userId: string;
    newToken: string;
    expiresAt: Date;
  }) {
    try {
      const { oldToken, userId, newToken, expiresAt } = payload;
      const [res] = await pool.execute(
        `UPDATE refresh_tokens 
         SET token = ?, expiresAt = ?
         WHERE userId = ? AND token = ?
         LIMIT 1`,
        [newToken, expiresAt, userId, oldToken]
      );

      const { affectedRows } = res as any;
      if (affectedRows === 0)
        throw new Error("No refresh token found to replace");
    } catch (error) {
      throw new Error("refreshOldToken -> " + error);
    }
  }
}
