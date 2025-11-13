import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { CasesModel } from "../model/cases.model.js";

export class CaseSerice {
  static async create(newCaseData: CasesModel): Promise<CasesModel> {
    try {
      const [res] = await pool.execute<ResultSetHeader>(
        `
  INSERT INTO cases
    (client_id, concern, description, paid, status, promise_to_pay)
  VALUES (?, ?, ?, ?, ?, ?)
  `,
        [
          newCaseData.client_id,
          newCaseData.concern,
          newCaseData.description,
          newCaseData.paid,
          newCaseData.status,
          newCaseData.promise_to_pay,
        ]
      );

      const caseData = await this.findById(res.insertId.toString());

      return caseData!;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string): Promise<CasesModel | null> {
    try {
      const [rows] = await pool.execute<(CasesModel & RowDataPacket)[]>(
        `SELECT * FROM cases WHERE id = ?`,
        [id]
      );

      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async getAll(): Promise<CasesModel[]> {
    try {
      const [rows] = await pool.query<(CasesModel & RowDataPacket)[]>(
        `SELECT * FROM cases`
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }
}
