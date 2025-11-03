import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { registration_request } from "../model/registration_request.model.js";

export class RegistrationRequestService {
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

  static async createRegistrationRequest(
    payload: registration_request
  ): Promise<void> {
    try {
      await pool.execute(
        `
          INSERT INTO registration_requests 
          (uid, email, first_name, last_name, password_hash, provider) 
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          payload.uid ?? null,
          payload.email,
          payload.firstName,
          payload.lastName,
          payload.password_hash ?? null,
          payload.provider,
        ]
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllRegistrationRequests(): Promise<registration_request[]> {
    try {
      const [rows] = await pool.query<(registration_request & RowDataPacket)[]>(
        "SELECT * FROM registration_request ORDER BY created_at DESC"
      );
      return rows;
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
}
