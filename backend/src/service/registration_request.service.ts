import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { registration_request } from "../model/registration_request.model.js";
import { users } from "../model/user.model.js";
import { ResponseType } from "../types/auth.types.js";
import { UsersService } from "./user.service.js";
import { MailerUtil } from "../util/mailer.util.js";

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

  static async getRegistrationRequestById(
    id: string
  ): Promise<registration_request | undefined> {
    try {
      const [rows] = await pool.query<(registration_request & RowDataPacket)[]>(
        "SELECT * FROM registration_request WHERE id = ?",
        [id]
      );
      return rows[0];
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

  static async deleteRegistrationRequestByUid(uid: string): Promise<boolean> {
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

  /**
   *  Drop Registration data  and add it in the user tables then notify user
   */
  static async registrationApproval(
    registrationData: registration_request
  ): Promise<void> {
    try {
      await this.deleteRegistrationRequestById(registrationData.id!);
      await UsersService.createUser(registrationData);

      await MailerUtil.adminApprovalEmail(registrationData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Admin rejection for the registration request, this will drop  the regstration
   * request  the db and inform the user for the rejection reason
   */
  static async rejectRegistrationRequest(payload: {
    registrationReq: registration_request;
    reason: string;
  }): Promise<void> {
    try {
      const { registrationReq, reason } = payload;

      await this.deleteRegistrationRequestById(registrationReq.id!);
      await MailerUtil.adminRejectionEmail(registrationReq, reason);
    } catch (error) {
      throw error;
    }
  }

  private static async deleteRegistrationRequestById(
    id: string
  ): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        "DELETE FROM registration_requests WHERE id = ?",
        [id]
      );

      // Check if any row was affected
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}
