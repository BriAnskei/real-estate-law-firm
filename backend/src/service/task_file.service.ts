import { RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { FileType, TaskFileModel } from "../model/task_files.model.js";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class TaskFileService {
  static async createFiles(
    payload: {
      files: Express.Multer.File[];
      task_id: string;
      file_type: FileType;
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

  /**
   * Process file uploads depending on the upload type.
   *
   * This function provides a unified interface for handling two cases:
   *
   *  ASSIGNER_UPLOAD:
   *    - Creates new file records
   *    - Saves metadata to the database
   *
   *  SUBMISSION:
   *    - Deletes all existing file records for the task
   *    - Saves all newly uploaded files to the database
   */
  static async processFileUpload(payload: {
    task_id: string;
    file_type: FileType;
    files: Express.Multer.File[];
  }): Promise<void> {
    const { file_type, files } = payload;

    const connection = await pool.getConnection();
    try {
      if (file_type === "ASSIGNER_UPLOAD" && files.length > 0) {
        await this.createFiles(payload, connection);
      } else if (file_type === "SUBMISSION") {
        await this.proccessUpdateSavedFiles(payload, connection);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
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
      file_type: FileType;
      files?: Express.Multer.File[];
    },
    connection: PoolConnection
  ) {
    const { task_id, file_type, files } = payload;

    try {
      await this.delete({ taskId: task_id, file_type }, connection);

      if (!files || files.length === 0) return; // no need to update or add if there is not file

      await this.createFiles({ files, task_id, file_type }, connection);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async delete(
    payload: { taskId: string; file_type?: FileType },
    connection: PoolConnection
  ) {
    const { taskId, file_type } = payload;
    try {
      const vals = [];

      let condition = "task_id = ?";
      vals.push(taskId);

      if (file_type) {
        condition += " AND  file_type = ?";
        vals.push(file_type);
      }

      await connection.execute(
        `
  DELETE FROM task_files WHERE ${condition}
  `,
        [...vals]
      );
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
        DELETE tf 
        FROM task_files tf
        JOIN tasks t ON tf.task_id = t.id
        JOIN case_stages cs ON t.case_stage_id = cs.id
        WHERE cs.case_id = ?;
        `,
        [caseId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
