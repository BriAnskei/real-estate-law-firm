import jwt from "jsonwebtoken";
import crypto from "crypto";
import { refreshToken } from "../model/refreshToken.model.js";

export class TokenUtils {
  static generateAccessToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "15m",
    });
  }

  static generateRefreshToken(payload: {
    userId: string;
    rememberMe: boolean;
  }) {
    const { userId, rememberMe } = payload;
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: rememberMe ? "7d" : "1h",
    });
  }

  static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  static verifyToken(token: string, hash: string): boolean {
    const computedHash = this.hashToken(token);
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
  }

  static decodeToken(accessToken: string): string {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as {
        userId: string;
      };

      return decoded.userId as string;
    } catch (error) {
      throw new Error("Error decoding token " + error);
    }
  }

  static decodeRefreshToken(refreshToken: string): string {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as {
        userId: string;
      };
      return decoded.userId as string;
    } catch (error) {
      throw error;
    }
  }

  static isTokenExpired(refreshToken: string): boolean {
    try {
      this.decodeRefreshToken(refreshToken);
      return false;
    } catch (error) {
      return true;
    }
  }
}
