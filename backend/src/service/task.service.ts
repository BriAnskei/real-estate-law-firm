import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { taskModel, TaskType } from "../model/taskModel.js";
import { ResponseType } from "../types/auth.types.js";
import { TaskFileService } from "./task_file.service.js";
import { PoolConnection } from "mysql2/promise";
import { FileType } from "../model/task_files.model.js";

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
        hearing_id,
      } = payload;

      const [row] = await pool.execute<ResultSetHeader>(
        `
      INSERT INTO tasks
      (case_stage_id, stage_name, title, description, assign_by, assign_to, due_date, hearing_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          case_stage_id,
          stage_name,
          title,
          description,
          assign_by,
          assign_to,
          due_date,
          hearing_id,
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

  static async getAllByHearing({
    hearing_id,
    case_stage_id,
  }: {
    hearing_id: string;
    case_stage_id: string;
  }): Promise<TaskType[]> {
    try {
      const [rows] = await pool.execute<(TaskType & RowDataPacket)[]>(
        `
      ${TASK_SELECT_BASE}
      WHERE t.hearing_id = ?
      AND t.case_stage_id = ?
      ORDER BY t.created_at DESC
      `,
        [hearing_id, case_stage_id]
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

  static async isAllStageTaskComplete(stageId: string): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT EXISTS(
      SELECT 1 FROM tasks
      WHERE case_stage_id = ?
        AND status = 'pending'
    ) AS hasPending`,
        [stageId]
      );

      const hasPending: boolean = rows[0].hasPending === 0;

      return hasPending;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async isAllHearingTaskComplete(hearing_id: string): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `
      SELECT EXISTS(
        SELECT 1 
        FROM tasks
        WHERE hearing_id = ?
          AND status = 'pending'
      ) AS hasPending;
      `,
        [hearing_id]
      );

      return rows[0].hasPending === 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async processUpdateTask(payload: {
    id: string;
    formData: FormData;
    file_type: FileType;
    files?: Express.Multer.File[];
  }): Promise<TaskType> {
    const { id, formData, file_type, files } = payload;

    const connection = await pool.getConnection();
    try {
      await TaskFileService.proccessUpdateSavedFiles(
        { task_id: id, file_type, files },
        connection
      );

      if (!formData || Object.keys(formData).length === 0) {
        // early commit, theres no need to update field in this case

        await connection.commit();
        return await this.findById(id.toString());
      }
      await this.update({ id, formData }, connection);

      await connection.commit();
      return await this.findById(id.toString());
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(
    payload: { id: string; formData: FormData },
    connection: PoolConnection
  ): Promise<void> {
    const { id, formData } = payload;
    try {
      // SET key = ?
      const setKeys = [];

      // values
      const values = [];

      for (var key in formData) {
        setKeys.push(`${key} = ?`);
        values.push(formData[key as keyof FormData]);
      }
      values.push(id);

      const [res] = await connection.execute<ResultSetHeader>(
        `
        UPDATE tasks SET ${setKeys.join(", ")} WHERE id = ?
        
        `,
        [...values]
      );

      if (res.affectedRows === 0) throw new Error("Task not Fount");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async markTaskAsComplete(taskId: string): Promise<void> {
    try {
      await pool.execute(
        `
  UPDATE tasks
SET status = 'complete'
WHERE id = ?;
  `,
        [taskId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async addCommentCount(
    taskId: string,
    connection: PoolConnection
  ): Promise<void> {
    try {
      await connection.execute(
        `
      UPDATE tasks
SET comments_count = comments_count + 1
WHERE id = ?;
      `,
        [taskId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async processTaskDeletion(id: string): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await this.deleteById(id, connection);
      await TaskFileService.delete({ taskId: id }, connection);

      await connection.commit();
    } catch (err) {
      await connection.rollback();

      console.error(err);
      throw err;
    } finally {
      connection.release();
    }
  }

  static async deleteById(
    id: string,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const poolRequest = connection ?? pool;

      const [res] = await poolRequest.execute(
        `
        DELETE FROM tasks WHERE id = ?

        `,
        [id]
      );

      if ((res as any).affectedRows === 0)
        throw new Error("Task does not exist");
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
      await connection.execute<ResultSetHeader>(
        `
      DELETE t FROM tasks t JOIN case_stages cs 
      ON t.case_stage_id = cs.id WHERE cs.case_id = ?
        `,
        [caseId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
