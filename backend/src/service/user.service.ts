import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { users } from "../model/user.model.js";
import { PasswordUtils } from "../util/password.util.js";
import { ResponseType, SignInPayload } from "../types/auth.types.js";

export class UsersService {
  static async findUserById(userId: string): Promise<ResponseType<users>> {
    try {
      const [rows] = await pool.execute<(users & RowDataPacket)[]>(
        `SELECT * FROM users WHERE id = ?`,
        [userId]
      );

      if (!rows[0]) {
        return { success: false, message: "User does not exist" };
      }

      return { success: true, data: rows[0] };
    } catch (error) {
      throw new Error("findUserById  -> " + error);
    }
  }

  static async findUserByEmail(email: string): Promise<users | undefined> {
    try {
      const [rows] = await pool.execute<(users & RowDataPacket)[]>(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error("-> findUserByEmail, " + error);
    }
  }

  /**
   *
   *  find user by email if it exist, if it does verify password
   */
  static async verifySignInCredentials(
    payload: SignInPayload
  ): Promise<ResponseType<users>> {
    try {
      const { email, password, role } = payload;
      const userData = await this.findUserByEmail(email);

      if (!userData)
        return {
          success: false,
          message: "User does not exist",
        };

      const isCredentialValid = await PasswordUtils.verifyPassword(
        password,
        userData?.password_hash!
      );

      if (!isCredentialValid || userData?.role !== role) {
        return {
          success: false,
          message: "Invalid login credentials. Please try again.",
        };
      }

      return { success: true, data: userData };
    } catch (error) {
      throw new Error("-> verifySignInCredentials" + error);
    }
  }
}
