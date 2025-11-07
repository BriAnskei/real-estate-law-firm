import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { registration_request } from "../model/registration_request.model.js";
import { users } from "../model/user.model.js";
import { ResponseType } from "../types/auth.types.js";
import { UsersService } from "./user.service.js";

export class RegistrationRequestService {
  static async createRegistrationRequest(
    payload: registration_request
  ): Promise<void> {
    try {
      await pool.execute(
        `
          INSERT INTO registration_requests 
          (uid, email, firstName, lastName, role, password_hash, provider) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          payload.uid ?? null,
          payload.email,
          payload.firstName,
          payload.lastName,
          payload.role,
          payload.password_hash ?? null,
          payload.provider ?? "manual",
        ]
      );
    } catch (error) {
      throw error;
    }
  }

  static async getRegistrationRequestByUid(
    uid: string
  ): Promise<registration_request | undefined> {
    try {
      const [rows] = await pool.query<(registration_request & RowDataPacket)[]>(
        "SELECT * FROM registration_request WHERE uid = ?",
        [uid]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findRegistrationByEmail(
    email: string
  ): Promise<registration_request | undefined> {
    try {
      const [rows] = await pool.execute<
        (registration_request & RowDataPacket)[]
      >(`SELECT * FROM registration_requests WHERE email = ?`, [email]);
      return rows[0];
    } catch (error) {
      throw new Error("-> findUserByEmail, " + error);
    }
  }

  static async findByEmailOrName(
    searchTerm: string
  ): Promise<registration_request[] | undefined> {
    try {
      let query = `
      SELECT * FROM registration_requests 
      WHERE email LIKE ? 
         OR firstName LIKE ? 
         OR lastName LIKE ?
      ORDER BY id DESC
    `;

      const likeValue = `%${searchTerm}%`;
      const params = [likeValue, likeValue, likeValue];

      const [rows] = await pool.query<(registration_request & RowDataPacket)[]>(
        query,
        params
      );
      return rows;
    } catch (error) {
      throw new Error("findByEmailOrName -> " + error);
    }
  }

  /**
   *
   * verifies the user if it is a valid admin before fetch all the request
   */
  static async getAllRegistrationRequests(
    userId: string
  ): Promise<ResponseType<registration_request[]>> {
    console.log("fetching request");
    try {
      const response = await UsersService.isUserAdmin(userId);

      if (!response.success) {
        return { ...response };
      }

      const [rows] = await pool.query<(registration_request & RowDataPacket)[]>(
        "SELECT * FROM registration_requests ORDER BY created_at DESC"
      );
      return { success: true, data: rows };
    } catch (error) {
      throw error;
    }
  }

  async updateRegistrationRequestStatus(
    uid: string,
    status: "pending" | "approved" | "rejected"
  ): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        "UPDATE registration_request SET status = ? WHERE uid = ?",
        [status, uid]
      );

      return (result as any).affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteRegistrationRequestByUid(uid: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        "DELETE FROM registration_request WHERE uid = ?",
        [uid]
      );

      // Check if any row was affected
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}
