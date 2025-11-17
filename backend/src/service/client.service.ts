import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { ClientModel } from "../model/clientModel.js";
import { ResponseType } from "../types/auth.types.js";
import { CaseService } from "./case.service.js";

export class ClientService {
  static async addClient(
    client: ClientModel,
    connection: PoolConnection
  ): Promise<string> {
    try {
      const [row] = await connection.execute<ResultSetHeader>(
        `
      INSERT INTO client (client_name, address, contact_number, email)
      VALUES (?, ?, ?, ?)
      `,
        [
          client.client_name,
          client.address,
          client.contact_number,
          client.email,
        ]
      );

      return row.insertId.toString();
    } catch (error) {
      throw error;
    }
  }

  static async getAll(): Promise<ClientModel[]> {
    try {
      const [rows] = await pool.query<(ClientModel & RowDataPacket)[]>(`
        
        SELECT * FROM client
        `);
      return rows;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  static async findById(id: string): Promise<ResponseType<ClientModel>> {
    try {
      const [rows] = await pool.execute<(ClientModel & RowDataPacket)[]>(
        `
      SELECT * FROM client WHERE id = ?
      `,
        [id]
      );

      if (!rows[0]) return { success: false, message: "client does not exist" };

      return { success: true, data: rows[0] };
    } catch (error) {
      throw error;
    }
  }

  static async updateClient(
    id: string,
    client: Partial<ClientModel>,
    connection?: PoolConnection
  ): Promise<ResponseType<null>> {
    try {
      const db = connection || pool;

      // Dynamically build SET statements
      const entries = Object.entries(client).filter(
        ([_, value]) => value !== undefined
      );

      if (entries.length === 0) {
        return { success: false, message: "No fields to update" };
      }

      const fields = entries.map(([key]) => `${key} = ?`).join(", ");
      const values = entries.map(([_, value]) => value);

      values.push(id);

      const [result] = await db.execute<ResultSetHeader>(
        `
      UPDATE client
      SET ${fields}
      WHERE id = ?
      `,
        values
      );

      if (result.affectedRows === 0) {
        return { success: false, message: "Client not found" };
      }

      return { success: true, message: "Client updated successfully" };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // check if client has transaction records before deleting
      const response = await CaseService.findByClientId(id);

      if (response.success)
        throw new Error(
          "Unable to delete client: The client is associated with existing case records."
        );

      const [res] = await pool.execute(
        `
  DELETE FROM client WHERE id = ?  ORDER BY created_at DEST
  `,
        [id]
      );

      if (!((res as any).affectedRows > 0))
        throw new Error("This client does not exist");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
