import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { TaskReviewModel } from "../model/task_reviews.model.js";
import { ResponseType } from "../types/auth.types.js";
import { TaskService } from "./task.service.js";

const REVIEW_SELECT_BASE = `SELECT 
    tr.id,
    tr.task_id,
    tr.reviewer_id,
    tr.comment,
    tr.reviewed_at,
    CONCAT(u.firstName, ' ', u.lastName) AS reviewer_fullname,
    u.role AS reviewer_role
    FROM task_reviews tr
    LEFT JOIN users u ON tr.reviewer_id = u.id`;

export class TaskReviewService {
  static async add(newReview: TaskReviewModel): Promise<TaskReviewModel> {
    const connection = await pool.getConnection();
    try {
      const [row] = await connection.execute<ResultSetHeader>(
        `
      INSERT INTO task_reviews (task_id, reviewer_id, comment)
      VALUES (?, ?, ?);
      `,
        [newReview.task_id, newReview.reviewer_id, newReview.comment]
      );

      await TaskService.addCommentCount(newReview.task_id, connection);

      await connection.commit();
      return (await this.findById(row.insertId.toString())).data!;
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async fetchAllTaskReviews(taskId: string): Promise<TaskReviewModel[]> {
    try {
      const [rows] = await pool.execute<(TaskReviewModel & RowDataPacket)[]>(
        `
 ${REVIEW_SELECT_BASE} WHERE tr.task_id = ?;
        `,
        [taskId]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(id: string): Promise<ResponseType<TaskReviewModel>> {
    try {
      const [rows] = await pool.execute<(TaskReviewModel & RowDataPacket)[]>(
        `
        ${REVIEW_SELECT_BASE} WHERE tr.id = ?;
        `,
        [id]
      );

      if (!rows.length)
        return { success: false, message: "Task review not found" };

      return { success: true, data: rows[0] };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
