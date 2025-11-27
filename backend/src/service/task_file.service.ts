import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { TaskFileModel } from "../model/task_files.model.js";

export class TaskFileService {
  static async createFiles(payload: {
    files: Express.Multer.File[];
    task_id: string;
    file_type: string;
  }) {
    try {
      const { files, task_id, file_type } = payload;

      for (const file of files) {
        await pool.execute(
          `
            INSERT INTO task_files (task_id, file_name, original_name, file_path, file_type)
            VALUES (?, ?, ?, ?, ?)
            `,
          [task_id, file.filename, file.originalname, file.path, file_type]
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getFileByTask(payload: {
    task_id: string;
    file_type: string;
  }): Promise<TaskFileModel[]> {
    try {
      const { task_id, file_type } = payload;
      const [rows] = await pool.execute<(TaskFileModel & RowDataPacket)[]>(
        `
          SELECT * FROM task_files WHERE task_id = ? AND file_type  = ?
          `,
        [task_id, file_type]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
