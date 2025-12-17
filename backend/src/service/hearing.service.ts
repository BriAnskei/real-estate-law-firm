import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { HearingModel } from "../model/hearing.model.js";
import { PoolConnection } from "mysql2/promise";
import { PostponementService } from "./postponed_hearing.service.js";
import { HearingCancellationService } from "./hearing_cancellation.service.js";
import { ResponseType } from "../types/auth.types.js";
import { TaskService } from "./task.service.js";
import { NotificationService } from "./notification.service.js";
import { CaseStageService } from "./case_stage.service.js";
import { CaseLogService } from "./case_log.service.js";

const HEARING_SELECT_BASE = `
    SELECT 
      h.*
    FROM hearings h
`;

export class HearingService {
  static async add(payload: {
    hearingData: HearingModel;
    userId: string;
  }): Promise<HearingModel> {
    const connection = await pool.getConnection();

    try {
      const { hearingData, userId } = payload;

      const [row] = await connection.execute<ResultSetHeader>(
        `
        INSERT INTO hearings
        (case_id, type, scheduled_date)
        VALUES (?, ?, ?)
        `,
        [hearingData.case_id, hearingData.type, hearingData.scheduled_date]
      );

      // add log
      await CaseLogService.create(
        {
          case_id: Number(hearingData.case_id),
          user_id: Number(userId),
          type: "hearing_scheduled",
          title: "Task Added",
          description: `${hearingData.type} has been added`,
          metadata: {
            stage_name: "Hearing/Case Proper",
          },
        },
        connection
      );

      await CaseStageService.processSelectHearingSched({
        case_id: hearingData.case_id,
        hearingId: row.insertId.toString(),
      });

      await NotificationService.caseNewHearing(
        {
          related_case_id: hearingData.case_id,
          user_id: userId,
          hearing_type: hearingData.type,
        },
        connection
      );

      return await this.findById(row.insertId.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getUpcomingHearings(): Promise<
    {
      case_concern: string;
      hearing_type: string;
      scheduled_date: Date;
    }[]
  > {
    try {
      const [rows] = await pool.execute<
        (RowDataPacket & {
          case_concern: string;
          hearing_type: string;
          scheduled_date: Date;
        })[]
      >(
        `
      SELECT
        c.concern AS case_concern,
        h.type AS hearing_type,
        h.scheduled_date
      FROM hearings h
      INNER JOIN cases c ON c.id = h.case_id
      WHERE h.status = 'scheduled'
        AND h.scheduled_date >= NOW()
        AND h.scheduled_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)
      ORDER BY h.scheduled_date ASC
      `
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUpcomingHearingsCount(): Promise<number> {
    try {
      const [rows] = await pool.execute<
        (RowDataPacket & { upcoming_hearings_count: number })[]
      >(
        `
      SELECT COUNT(*) AS upcoming_hearings_count
      FROM hearings
      WHERE status = 'scheduled'
        AND scheduled_date >= NOW()
        AND scheduled_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)
      `
      );

      return rows[0].upcoming_hearings_count;
    } catch (error) {
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

    userId: string; // who postponed
  }): Promise<void> {
    const { hearing_id, new_date, userId, reason, old_date } = payload;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const hearingData = await this.findById(hearing_id, connection);

      await NotificationService.hearingPosponent(
        {
          related_case_id: hearingData.case_id,
          user_id: userId,
          hearingType: hearingData.type,
        },
        connection
      );

      await this.postponeHearing({ hearing_id, new_date }, connection);

      // add new history
      await PostponementService.add(
        {
          hearing_id,
          old_date,
          new_date,
          reason,
        },
        connection
      );

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
    userId: string;
  }): Promise<void> {
    const { hearing_id, reason, userId } = payload;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await this.updateHearingStatus(
        { hearing_id, status: "cancelled", userId },
        connection
      );

      // add record
      await HearingCancellationService.add(
        {
          hearing_id,
          reason,
        },
        connection
      );

      await NotificationService.hearingStatus(
        { userId, hearingId: hearing_id },
        connection
      );

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
    payload: { hearing_id: string; status: string; userId: string },
    connection?: PoolConnection
  ): Promise<ResponseType<undefined>> {
    const { hearing_id, status, userId } = payload;

    const sqlConnection = connection ?? (await pool.getConnection());

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

        await NotificationService.hearingStatus(
          { userId, hearingId: hearing_id, status: "completed" },
          sqlConnection
        );
      }

      if (!connection) await sqlConnection.beginTransaction();

      const [row] = await sqlConnection.execute<ResultSetHeader>(
        `
        UPDATE hearings SET status = ? WHERE id = ?
        `,
        [status, hearing_id]
      );

      if (!connection) await sqlConnection.commit();

      if (row.affectedRows === 0) throw new Error("Hearing does not exist");
      return { success: true };
    } catch (error) {
      if (!connection) await sqlConnection.rollback();
      console.error(error);
      throw error;
    } finally {
      if (!connection) sqlConnection.release();
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
