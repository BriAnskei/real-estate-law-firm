import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { refreshToken } from "../model/refreshToken.model.js";
import { ResponseType } from "../types/auth.types.js";
import { TokenUtils } from "../util/token.util.js";

export class TokenService {
  static async createRefreshToken(payload: refreshToken) {
    try {
      const { token, userId, rememberMeIssued, expiresAt, session_id } =
        payload;

      const hashedRefreshToken = TokenUtils.hashToken(token);

      const columns: string[] = [
        "token",
        "userId",
        "rememberMeIssued",
        "expiresAt",
      ];

      const values: any[] = [
        hashedRefreshToken,
        userId,
        rememberMeIssued,
        expiresAt,
      ];

      if (session_id) {
        columns.splice(3, 0, "session_id"); // insert before expiresAt
        values.splice(3, 0, session_id);
      }

      const placeholders = columns.map(() => "?").join(", ");

      await pool.execute(
        `INSERT INTO refresh_tokens (${columns.join(", ")})
       VALUES (${placeholders})`,
        values
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
      console.error(error);

      throw new Error(`findByToken -> ${(error as Error).message}`);
    }
  }

  /**
   *
   *  issue a fresh tokens and update the old refreshToken to new generated token
   *  @returns accessToken, refreshToken
   */

  static async handleTokenRotation(paylaod: {
    refreshTokenId: string;
    userId: string;
    rememberMeIssued: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId, rememberMeIssued, refreshTokenId } = paylaod;
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
      refreshTokenId,
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
    refreshTokenId: string;
    newToken: string;
    expiresAt: Date;
  }) {
    try {
      const { refreshTokenId, newToken, expiresAt } = payload;

      const hashedRefreshToken = TokenUtils.hashToken(newToken);

      const [res] = await pool.execute(
        `UPDATE refresh_tokens 
         SET token = ?, expiresAt = ?
         WHERE id = ? LIMIT 1`,
        [hashedRefreshToken, expiresAt, refreshTokenId]
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
  }

  /**
   *
   * find token if it exist, validate expiration date,
   * returns decodedRefreshToken(userId) and rememberMeIssued.
   * If token is expired delete token and returns expired message emediately
   */
  static async validateRefreshToken(refreshToken: string): Promise<
    ResponseType<{
      decodedUserId: string;
      rememberMe: boolean;
      refreshTokenId: string;
    }>
  > {
    try {
      // check if the refresh token is expired
      const isRefreshTokenExpired = TokenUtils.isTokenExpired(refreshToken);
      if (isRefreshTokenExpired) {
        await this.deleteByToken(refreshToken);
        return { success: false, message: "Token expired, please login again" };
      }

      const tokenData = await this.findByToken(refreshToken);

      return {
        success: true,
        data: {
          decodedUserId: TokenUtils.decodeRefreshToken(refreshToken),
          rememberMe: tokenData.rememberMeIssued!,
          refreshTokenId: tokenData.id!,
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
