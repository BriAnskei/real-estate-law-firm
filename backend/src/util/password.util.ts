// utils/password.utils.ts
import argon2 from "argon2";

export class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64MB
        timeCost: 3,
        parallelism: 1,
      });
    } catch (error) {
      throw new Error("Error hashing password");
    }
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      console.error("Error verifying password:", error);
      return false;
    }
  }
}
