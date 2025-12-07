import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { HearingModel } from "../model/hearing.model.js";
import { PoolConnection } from "mysql2/promise";
import { PostponementService } from "./postponed_hearing.service.js";
import { HearingCancellationService } from "./hearing_cancellation.service.js";
import { ResponseType } from "../types/auth.types.js";
import { TaskService } from "./task.service.js";

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

  static async filter(payload: {
    case_id: string;
    query?: string;
    status?: string;
  }): Promise<HearingModel[]> {
    try {
      const { query, status, case_id } = payload;

      const conditions: string[] = [];
      const params: string[] = [];

      if (query && query.trim() !== "") {
        conditions.push("(h.type LIKE ?)");
        params.push(`%${query}%`);
      }

      if (status && status !== "" && status !== "all") {
        conditions.push("h.status = ?");
        params.push(status);
      }

      conditions.push("h.case_id = ?");
      params.push(case_id);

      const whereClause =
        conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

      const [rows] = await pool.execute<(HearingModel & RowDataPacket)[]>(
        `
      ${HEARING_SELECT_BASE}
      ${whereClause}
      ORDER BY h.scheduled_date ASC
      `,
        params
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(
    id: string,
    connection?: PoolConnection
  ): Promise<HearingModel> {
    try {
      const sqlPool = connection ?? pool;

      const [rows] = await sqlPool.execute<(HearingModel & RowDataPacket)[]>(
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

  static async areAllHearingsNotScheduled(case_id: string): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `
      SELECT EXISTS(
        SELECT 1
        FROM hearings
        WHERE case_id = ?
          AND status = 'scheduled'
      ) AS hasScheduled;
      `,
        [case_id]
      );

      return rows[0].hasScheduled === 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async isHearingExist(
    id: string,
    connection?: PoolConnection
  ): Promise<boolean> {
    try {
      const hearingData = await this.findById(id, connection);

      return Boolean(hearingData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async isHearingPartOfCase(
    payload: {
      hearing_id: string;
      case_id: string;
    },
    connection?: PoolConnection
  ): Promise<boolean> {
    try {
      const sqlConnection = connection ?? pool;

      const { hearing_id, case_id } = payload;

      const [rows] = await sqlConnection.execute<
        (HearingModel & RowDataPacket)[]
      >(
        `
        SELECT id 
        FROM hearings
        WHERE id = ? AND case_id = ?
      `,
        [hearing_id, case_id]
      );

      return rows.length > 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateType(
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

  static async proccessHearingPostponement(payload: {
    hearing_id: string;
    old_date: string;
    new_date: string;
    reason: string;
  }): Promise<void> {
    const { hearing_id, new_date } = payload;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await this.postponeHearing({ hearing_id, new_date }, connection);

      // add new history
      await PostponementService.add(payload, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  private static async postponeHearing(
    payload: { hearing_id: string; new_date: string },
    connection: PoolConnection
  ): Promise<void> {
    const { hearing_id, new_date } = payload;

    try {
      const [row] = await connection.execute<ResultSetHeader>(
        `
        UPDATE hearings SET scheduled_date = ? WHERE id = ?
        `,
        [new_date, hearing_id]
      );

      if (row.affectedRows === 0) throw new Error("Hearing does not exist");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async proccessHearingCancelation(payload: {
    hearing_id: string;
    reason: string;
  }): Promise<void> {
    const { hearing_id } = payload;
    const connection = await pool.getConnection();
    try {
      await this.updateHearingStatus(
        { hearing_id, status: "cancelled" },
        connection
      );

      // add record
      await HearingCancellationService.add({ ...payload }, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateHearingStatus(
    payload: { hearing_id: string; status: string },
    connection?: PoolConnection
  ): Promise<ResponseType<undefined>> {
    const { hearing_id, status } = payload;
    try {
      if (status === "completed") {
        const isAllTaskComplete = await TaskService.isAllHearingTaskComplete(
          hearing_id
        );

        if (!isAllTaskComplete)
          return {
            success: false,
            message:
              "Completion of all tasks is required to process this request.",
          };
      }

      const sqlConnection = connection ?? pool;

      const [row] = await sqlConnection.execute<ResultSetHeader>(
        `
        UPDATE hearings SET status = ? WHERE id = ?
        `,
        [status, hearing_id]
      );
      if (row.affectedRows === 0) throw new Error("Hearing does not exist");
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async proccessHearingSchedDeletion(id: string): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await this.deleteById(id, connection);
      await PostponementService.deleteAllByHearingId(id, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
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
