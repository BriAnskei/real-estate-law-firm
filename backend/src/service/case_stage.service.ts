import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { CaseStageModel } from "../model/cases.model.js";
import { PoolConnection } from "mysql2/promise";
import { ResponseType } from "../types/auth.types.js";
import { TaskService } from "./task.service.js";
import { CaseService } from "./case.service.js";
import { HearingService } from "./hearing.service.js";
import { HearingModel } from "../model/hearing.model.js";

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

  static async getSelectedHearing(caseId: string): Promise<number | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `
      SELECT selected_hearing_id 
      FROM case_stages 
      WHERE case_id = ? AND stage_name = 'HEARING'
      LIMIT 1
      `,
        [caseId]
      );

      if (rows.length === 0) return null;

      return rows[0].selected_hearing_id ?? null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async processSelectHearingSched(
    payload: {
      case_id: string;
      hearingId: string;
    },
    connection?: PoolConnection
  ): Promise<ResponseType<{ hearingData: HearingModel }>> {
    const { case_id, hearingId } = payload;

    try {
      const hearingData = await HearingService.findById(hearingId, connection);
      const isCaseActive = await CaseService.isCaseActive(case_id, connection);

      if (!isCaseActive)
        throw new Error("Cannot select hearing for unactive case");

      const isHearingPartOfCase = await HearingService.isHearingPartOfCase(
        {
          case_id,
          hearing_id: hearingId!,
        },
        connection
      );

      if (!isHearingPartOfCase) {
        throw new Error("Cannot select hearing that is not part of the case");
      }

      await this.setSelectedHearing(payload, connection);

      return { success: true, data: { hearingData } };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async setSelectedHearing(
    payload: {
      case_id: string;
      hearingId: string | null; // allow unselecting
    },
    connection?: PoolConnection
  ): Promise<ResponseType<undefined>> {
    const { case_id, hearingId } = payload;

    try {
      const sqlConnection = connection ?? pool;

      const [row] = await sqlConnection.execute<ResultSetHeader>(
        `
      UPDATE case_stages 
      SET selected_hearing_id = ?
      WHERE stage_name = 'HEARING' AND case_id = ?
      `,
        [hearingId, case_id]
      );

      if (row.affectedRows === 0)
        throw new Error("Hearing does does not exist");

      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async processCaseStageUpdate(payload: {
    caseId: string;
    stageId: string;
    status: string;
    stage_name: string;
  }): Promise<ResponseType<{ isAllStageComplete: boolean }>> {
    const { caseId, stageId, status, stage_name } = payload;

    const connection = await pool.getConnection();
    try {
      // if stage is hearing stage, check if all hearing is not schduled
      if (
        stage_name === "HEARING" &&
        !(await HearingService.areAllHearingsNotScheduled(caseId))
      )
        return {
          success: false,
          message:
            "Complemention of all hearing is required to make this stage as complete",
        };

      const response = await this.updateStatus(
        { id: stageId, status: status, stage: stage_name },
        connection
      );

      if (!response.success) return { ...response };

      const isAllStageComplete = await this.isAllStageComplete(
        caseId,
        connection
      );

      const caseCurrentStatus = await CaseService.fetchCaseStatus(
        caseId,
        connection
      );

      const newCaseStatus = isAllStageComplete ? "complete" : "ongoing";

      if (isAllStageComplete || caseCurrentStatus !== newCaseStatus) {
        await CaseService.updateCaseStatus(
          { id: caseId, status: newCaseStatus },
          connection
        );
      }

      await connection.commit();

      return { success: true, data: { isAllStageComplete } };
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  private static async isAllStageComplete(
    caseId: string,
    connection: PoolConnection
  ): Promise<boolean> {
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `
        SELECT NOT EXISTS (SELECT 1 FROM case_stages WHERE case_id = ? AND
         stage_status != 'complete') as allStagesComplete
        `,
        [caseId]
      );

      const isAllComplete = rows[0].allStagesComplete === 1;

      return isAllComplete;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateStatus(
    payload: {
      id: string;
      status: string;
      stage: string;
    },
    connection: PoolConnection
  ): Promise<ResponseType<undefined>> {
    const { id, status, stage } = payload;
    try {
      if (
        stage !== "HEARING" &&
        status === "complete" &&
        !(await TaskService.isAllStageTaskComplete(id))
      ) {
        return {
          success: false,
          message:
            "Completion of all tasks is required before marking the stage as complete.",
        };
      }

      const [res] = await connection.execute<ResultSetHeader>(
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

  static async deleteAllByCaseId(
    caseId: string,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const [res] = await connection.execute<ResultSetHeader>(
        `
  DELETE FROM case_stages WHERE case_id = ?
  `,
        [caseId]
      );

      if (res.affectedRows === 0)
        throw new Error("Failed to delete case_stages cannot found caseId");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
