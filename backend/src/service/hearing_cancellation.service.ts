import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import { HearingCancellationModel } from "../model/hearing_cancellation.model.js";

export class HearingCancellationService {
  static async add(
    payload: HearingCancellationModel,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const { hearing_id, reason } = payload;
      const usePool = connection ?? pool;

      await usePool.execute<ResultSetHeader>(
        `
        INSERT INTO hearing_cancellations
        (hearing_id, reason)
        VALUES (?, ?)
        `,
        [hearing_id, reason]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findByHearingId(
    hearingId: string
  ): Promise<HearingCancellationModel> {
    try {
      const [rows] = await pool.execute<
        (HearingCancellationModel & RowDataPacket)[]
      >(
        `
        SELECT *
        FROM hearing_cancellations
        WHERE hearing_id = ?
        `,
        [hearingId]
      );

      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async delete(id: string, connection: PoolConnection): Promise<void> {
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `
        DELETE FROM hearing_cancellations 
        WHERE hearing_id = ?
        `,
        [id]
      );
      if (result.affectedRows === 0) throw new Error("Notification not found");
    } catch (error) {
      throw error;
    }
  }
}
