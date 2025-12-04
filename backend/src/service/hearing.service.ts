import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { HearingModel, HearingStatusType } from "../model/hearing.model.js";
import { PoolConnection } from "mysql2/promise";

const HEARING_SELECT_BASE = `
    SELECT 
      h.*
    FROM hearings h
`;

export class HearingService {
  static async add(payload: HearingModel): Promise<HearingModel> {
    try {
      const { case_id, type, scheduled_date } = payload;

      const [row] = await pool.execute<ResultSetHeader>(
        `
        INSERT INTO hearings
        (case_id, type, scheduled_date)
        VALUES (?, ?, ?)
        `,
        [case_id, type, scheduled_date]
      );

      return await this.findById(row.insertId.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAllByCaseId(caseId: string): Promise<HearingModel[]> {
    try {
      const [rows] = await pool.execute<(HearingModel & RowDataPacket)[]>(
        `
        ${HEARING_SELECT_BASE}
        WHERE case_id = ?
        ORDER BY scheduled_date ASC
        `,
        [caseId]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(id: string): Promise<HearingModel> {
    try {
      const [rows] = await pool.execute<(HearingModel & RowDataPacket)[]>(
        `
        ${HEARING_SELECT_BASE}
        WHERE h.id = ?
        `,
        [id]
      );

      if (!rows.length) throw new Error("Hearing does not exist");

      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async update(
    payload: { id: string; newType: string },
    connection?: PoolConnection
  ): Promise<void> {
    const { id, newType } = payload;

    try {
      const usePool = connection ?? pool;

      const [res] = await usePool.execute<ResultSetHeader>(
        `
        UPDATE hearings 
        SET type = ?
        WHERE id = ?
        `,
        [newType, id]
      );

      if (res.affectedRows === 0) throw new Error("Hearing does not exist");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteById(
    id: string,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const usePool = connection ?? pool;

      const [res] = await usePool.execute<ResultSetHeader>(
        `
        DELETE FROM hearings WHERE id = ?
        `,
        [id]
      );

      if (res.affectedRows === 0) throw new Error("Hearing does not exist");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteAllByCaseId(
    caseId: string,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const usePool = connection ?? pool;

      await usePool.execute<ResultSetHeader>(
        `
        DELETE FROM hearings
        WHERE case_id = ?
        `,
        [caseId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
