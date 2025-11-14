import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { refreshToken } from "../model/refreshToken.model.js";
import { ResponseType } from "../types/auth.types.js";
import { TokenUtils } from "../util/token.util.js";

export class TokenService {
  static async createRefreshToken(payload: refreshToken) {
    try {
      const { token, userId, rememberMeIssued, expiresAt } = payload;
      const hashedRefreshtoken = TokenUtils.hashToken(token);
      await pool.execute(
        `INSERT INTO refresh_tokens (token, userId, rememberMeIssued,  expiresAt)
      VALUES (?, ?, ?, ?)`,
        [hashedRefreshtoken, userId, rememberMeIssued, expiresAt]
      );
    } catch (error) {
      throw error;
    }
  }
  /**
   * Find the token data by refreshToken
   */
  static async findByToken(token: string): Promise<refreshToken> {
    try {
      const hashedRefreshToken = TokenUtils.hashToken(token);

      const [rows] = await pool.execute<(refreshToken & RowDataPacket)[]>(
        `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`,
        [hashedRefreshToken]
      );

      if (!rows[0]) {
        throw new Error("Unauthorized, please login again");
      }

      return rows[0];
    } catch (error) {
      throw new Error(`findByToken -> ${(error as Error).message}`);
    }
  }

  /**
   *
   *  issue a fresh tokens and update the old refreshToken to new generated token
   *  @returns accessToken, refreshToken
   */

  static async handleTokenRotation(paylaod: {
    userId: string;
    rememberMeIssued: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId, rememberMeIssued } = paylaod;
    const tokens = await this.generateTokens({
      userId,
      rememberMe: rememberMeIssued,
    });

    // calculates expiration date
    const today = new Date();
    const expirationDate = new Date(today);
    if (rememberMeIssued) {
      // +7 days
      expirationDate.setDate(today.getDate() + 7);
    } else {
      // +1 hour
      expirationDate.setHours(today.getHours() + 1);
    }

    await this.refreshOldToken({
      userId,
      newToken: tokens.refreshToken,
      expiresAt: expirationDate,
    });
    return tokens;
  }

  /**
   *
   * replace the old refrestToken and  expireAt with the new refreshToken
   */
  static async refreshOldToken(payload: {
    userId: string;
    newToken: string;
    expiresAt: Date;
  }) {
    try {
      const { userId, newToken, expiresAt } = payload;

      const hashedRefreshToken = TokenUtils.hashToken(newToken);

      const [res] = await pool.execute(
        `UPDATE refresh_tokens 
         SET token = ?, expiresAt = ?
         WHERE userId = ? LIMIT 1`,
        [hashedRefreshToken, expiresAt, userId]
      );

      const { affectedRows } = res as any;
      if (affectedRows === 0)
        throw new Error("No refresh token found to replace");
    } catch (error) {
      throw new Error("refreshOldToken -> " + error);
    }
  }

  static async deleteByToken(refreshToken: string) {
    const [res] = await pool.execute(
      `DELETE FROM refresh_tokens WHERE token = ?`,
      [refreshToken]
    );

    const { affectedRows } = res as any;
    if (affectedRows === 0) throw new Error("No refresh token found to delete");
  }

  /**
   *
   * find token if it exist, validate expiration date,
   * returns decodedRefreshToken(userId) and rememberMeIssued.
   * If token is expired delete token and returns expired message
   */
  static async validateRefreshToken(
    refreshToken: string
  ): Promise<ResponseType<{ decodedUserId: string; rememberMe: boolean }>> {
    try {
      const tokenData = await this.findByToken(refreshToken);

      if (TokenUtils.isTokenExpired(tokenData)) {
        await this.deleteByToken(tokenData.token);
        return { success: false, message: "Token expired, please login again" };
      }

      return {
        success: true,
        data: {
          decodedUserId: TokenUtils.decodeRefreshToken(refreshToken),
          rememberMe: tokenData.rememberMeIssued!,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async generateTokens(payload: {
    userId: string;
    rememberMe: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { userId, rememberMe } = payload;

      let refreshToken = TokenUtils.generateRefreshToken({
        userId,
        rememberMe,
      });
      let accessToken = TokenUtils.generateAccessToken(payload.userId);

      return { refreshToken, accessToken };
    } catch (error) {
      throw new Error("generateTokens -> " + error);
    }
  }
}
