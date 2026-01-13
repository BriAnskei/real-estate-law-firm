import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { users } from "../model/user.model.js";
import { PasswordUtils } from "../util/password.util.js";
import { ResponseType, SignInPayload } from "../types/auth.types.js";
import { Roles } from "../model/registration_request.model.js";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class UsersService {
  static async createUser(user: users): Promise<void> {
    try {
      await pool.execute(
        `
          INSERT INTO users 
          (uid, email, firstName, lastName, role, password_hash, provider) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          user.uid ?? null,
          user.email,
          user.firstName,
          user.lastName,
          user.role,
          user.password_hash ?? null,
          user.provider ?? "manual",
        ]
      );
    } catch (error) {
      throw error;
    }
  }

  static async getAllTotalUsers(filter?: {
    startDate?: string; // 'YYYY-MM-DD'
    endDate?: string; // 'YYYY-MM-DD'
  }): Promise<number> {
    try {
      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      if (filter?.startDate) {
        whereClause += " AND created_at >= ?";
        params.push(filter.startDate);
      }

      if (filter?.endDate) {
        whereClause += " AND created_at <= ?";
        params.push(filter.endDate);
      }

      const [rows] = await pool.execute<
        ({ total_users: number } & RowDataPacket)[]
      >(
        `
      SELECT COUNT(*) AS total_users
      FROM users
      ${whereClause}
      `,
        params
      );

      return rows[0].total_users;
    } catch (error) {
      throw error;
    }
  }

  static async fetchAllUsers(): Promise<users[]> {
    try {
      const [rows] = await pool.execute<(users & RowDataPacket)[]>(
        "SELECT * FROM users WHERE role != 'founding-manager/admin'"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async ftechByRole(role: Roles): Promise<users[]> {
    try {
      const [rows] = await pool.execute<(users & RowDataPacket)[]>(
        "SELECT * FROM users WHERE role  = ?",
        [role]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *  for filtering by name or emial
   */
  static async findByEmailOrName(
    searchTerm: string
  ): Promise<users[] | undefined> {
    try {
      const query = ` 
      SELECT * FROM users 
      WHERE role != 'founding-manager/admin'
        AND (
          email LIKE ? 
          OR firstName LIKE ? 
          OR lastName LIKE ?
        )
      ORDER BY id DESC
    `;

      const likeValue = `%${searchTerm}%`;
      const params = [likeValue, likeValue, likeValue];

      const [rows] = await pool.execute<(users & RowDataPacket)[]>(
        query,
        params
      );
      return rows;
    } catch (error) {
      throw new Error("findByEmailOrName -> " + error);
    }
  }

  static async findUserById(
    userId: string,
    connection?: PoolConnection
  ): Promise<ResponseType<users>> {
    try {
      const sqlPool = connection ?? pool;

      const [rows] = await sqlPool.execute<(users & RowDataPacket)[]>(
        `SELECT * FROM users WHERE id = ?`,
        [userId]
      );

      if (!rows[0]) {
        throw new Error("User does not exist");
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
      console.error(error);

      throw new Error("-> findUserByEmail, " + error);
    }
  }

  static async isUserAdmin(userId: string): Promise<ResponseType<undefined>> {
    try {
      const response = await this.findUserById(userId);

      if (!response.success)
        return { success: false, message: response.message };

      const userData = response.data!;

      if (userData.role !== "founding-manager/admin") {
        return { success: false, message: "not authorize, please login again" };
      }

      return { success: true };
    } catch (error) {
      throw new Error("isUserAdmin -> " + error);
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
