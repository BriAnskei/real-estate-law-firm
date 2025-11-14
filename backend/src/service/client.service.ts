import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { ClientModel } from "../model/clientModel.js";
import { ResponseType } from "../types/auth.types.js";

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

  static async findById(id: string): Promise<ResponseType<ClientModel>> {
    try {
      const [rows] = await pool.execute<(ClientModel & RowDataPacket)[]>(
        `
      SELECT * FROM cases WHERE id = ?
      `,
        [id]
      );

      if (!rows[0]) return { success: false, message: "client does not exist" };

      return { success: true, data: rows[0] };
    } catch (error) {
      throw error;
    }
  }
}
