import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { taskModel, TaskType } from "../model/taskModel.js";

const TASK_SELECT_BASE = `
    SELECT 
        t.*,
        CONCAT(u1.firstName, ' ', u1.lastName) AS assigner_name,
        CONCAT(u2.firstName, ' ', u2.lastName) AS assignee_name
    FROM tasks t
    LEFT JOIN users u1 ON u1.id = t.assign_by
    LEFT JOIN users u2 ON u2.id = t.assign_to
`;

export class TaskService {
  static async add(payload: taskModel): Promise<TaskType> {
    try {
      const {
        case_stage_id,
        stage_name,
        title,
        description,
        assign_by,
        assign_to,
        due_date,
      } = payload;

      const [row] = await pool.execute<ResultSetHeader>(
        `
        INSERT INTO tasks
        (case_stage_id, stage_name, title, description, assign_by, assign_to, due_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          case_stage_id,
          stage_name,
          title,
          description,
          assign_by,
          assign_to,
          due_date,
        ]
      );

      return await this.findById(row.insertId.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAll(payload: {
    case_stage_id: string;
    stage_name: string;
  }): Promise<TaskType[]> {
    try {
      const { case_stage_id, stage_name } = payload;
      const [rows] = await pool.execute<(TaskType & RowDataPacket)[]>(
        `
     ${TASK_SELECT_BASE} WHERE case_stage_id  = ? AND stage_name = ?  ORDER BY created_at DESC;
    `,
        [case_stage_id, stage_name]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(id: string): Promise<TaskType> {
    try {
      const [rows] = await pool.execute<(TaskType & RowDataPacket)[]>(
        `
         ${TASK_SELECT_BASE}  WHERE t.id = ?
        `,
        [id]
      );

      if (!rows.length) {
        throw new Error("Task does not exist");
      }

      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
