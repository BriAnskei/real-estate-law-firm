import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { CaseStageModel } from "../model/cases.model.js";

export class caseStageService {
  static async create(id: string) {
    try {
      await pool.execute(
        `
    INSERT INTO case_stage (case_id, stage_name, stage_status)
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

  static async getAllCaseStages(id: string): Promise<CaseStageModel[]> {
    try {
      const [rows] = await pool.execute<(CaseStageModel & RowDataPacket)[]>(
        `
        SELECT ^ FROM case_stages WHERE case_id = ?

        `,
        [id]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateStatus(payload: {
    id: string;
    status: string;
  }): Promise<void> {
    const { id, status } = payload;

    try {
      const [res] = await pool.execute<ResultSetHeader>(
        `
          UPDATE case_stages SET stage_status = ? WHERE  id = ?
        `,
        [status, id]
      );

      if (res.affectedRows === 0) throw new Error("No Status where updated");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
