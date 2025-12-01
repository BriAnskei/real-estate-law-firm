import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { CaseStageModel } from "../model/cases.model.js";
import { PoolConnection } from "mysql2/promise";
import { ResponseType } from "../types/auth.types.js";
import { TaskService } from "./task.service.js";

export class CaseStageService {
  static async create(id: string, connection: PoolConnection) {
    try {
      await connection.execute(
        `
    INSERT INTO case_stages (case_id, stage_name, stage_status)
      SELECT ?, stage, 'ongoing'
      FROM (
      SELECT 'MANAGE_REQUIREMENTS' AS stage
      UNION ALL
      SELECT 'FILING_DOCS'
      UNION ALL
      SELECT 'HEARING'
) AS stages;
  `,
        [id]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAllCaseStages(id: string): Promise<{
    requirementsStage: CaseStageModel;
    documentsStage: CaseStageModel;
    hearingStage: CaseStageModel;
  }> {
    try {
      const [rows] = await pool.execute<(CaseStageModel & RowDataPacket)[]>(
        `
        SELECT * FROM case_stages WHERE case_id = ?

        `,
        [id]
      );

      if (rows.length === 0) throw new Error("Cannot find case stages");

      // Encode stages in to an object
      const requirementsStage = rows.find(
        (s) => s.stage_name === "MANAGE_REQUIREMENTS"
      ) as CaseStageModel;

      const documentsStage = rows.find(
        (s) => s.stage_name === "FILING_DOCS"
      ) as CaseStageModel;

      const hearingStage = rows.find(
        (s) => s.stage_name === "HEARING"
      ) as CaseStageModel;

      return { requirementsStage, documentsStage, hearingStage };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateStatus(payload: {
    id: string;
    status: string;
  }): Promise<ResponseType<undefined>> {
    const { id, status } = payload;

    try {
      if (
        status === "complete" &&
        !(await TaskService.isAllStageTaskComplete(id))
      ) {
        return {
          success: false,
          message:
            "Completion of all tasks is required before marking the stage as complete.",
        };
      }

      const [res] = await pool.execute<ResultSetHeader>(
        `
          UPDATE case_stages SET stage_status = ? WHERE  id = ?
        `,
        [status, id]
      );

      if (res.affectedRows === 0) throw new Error("No Status where updated");

      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
