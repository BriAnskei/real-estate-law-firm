import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { HearingPostponedModel } from "../model/hearing_postponements.model.js";
import { PoolConnection } from "mysql2/promise";

export class PostponementService {
  static async add(
    payload: HearingPostponedModel,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { hearing_id, old_date, new_date, reason } = payload;

      await connection.execute<ResultSetHeader>(
        `
        INSERT INTO hearing_postponements
        (hearing_id, old_date, new_date, reason)
        VALUES (?, ?, ?, ?)
        `,
        [hearing_id, old_date, new_date, reason]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAllByHearingId(
    hearingId: string
  ): Promise<HearingPostponedModel[]> {
    try {
      const [rows] = await pool.execute<
        (HearingPostponedModel & RowDataPacket)[]
      >(
        `
        SELECT * 
        FROM hearing_postponements
        WHERE hearing_id = ?
        ORDER BY created_at DESC
        `,
        [hearingId]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(id: string): Promise<HearingPostponedModel> {
    try {
      const [rows] = await pool.execute<
        (HearingPostponedModel & RowDataPacket)[]
      >(
        `
        SELECT * 
        FROM hearing_postponements
        WHERE id = ?
        `,
        [id]
      );

      if (!rows.length)
        throw new Error("Hearing postponement record does not exist");

      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
