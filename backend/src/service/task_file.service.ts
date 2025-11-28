import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { TaskFileModel } from "../model/task_files.model.js";
import { PoolConnection } from "mysql2/promise";

export class TaskFileService {
  static async createFiles(
    payload: {
      files: Express.Multer.File[];
      task_id: string;
      file_type: string;
    },
    connection?: PoolConnection
  ) {
    try {
      const { files, task_id, file_type } = payload;

      const connectionPool = connection ?? pool;

      for (const file of files) {
        await connectionPool.execute(
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

  /**
   * Delete all data by task id, and then save the updated files
   * this implementation is same as how the multer is implemented
   */
  static async proccessUpdateSavedFiles(
    payload: {
      task_id: string;
      file_type: string;
      files?: Express.Multer.File[];
    },
    connection: PoolConnection
  ) {
    const { task_id, file_type, files } = payload;

    try {
      await this.delete(task_id, connection);

      if (!files) return; // no need to update or add if there is not file

      await this.createFiles({ files, task_id, file_type });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async delete(taskId: string, connection: PoolConnection) {
    try {
      await connection.execute(
        `
  DELETE FROM task_files WHERE task_id = ?
  `,
        [taskId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
