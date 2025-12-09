import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { NotificationModel } from "../model/notification.model..js";
import { PoolConnection } from "mysql2/promise";

const USER_BASE = `
  SELECT u.id, ?, ?, ?, ?
  FROM users AS u
`;

export class NotificationService {
  /**
   * Create a new notification
   */
  // static async tes(payload: NotificationModel): Promise<NotificationModel> {
  //   try {
  //     const {
  //       notification,
  //       user_id,
  //       type,
  //       related_case_id,
  //       related_task_id,
  //       message,
  //     } = payload;

  //     const [row] = await pool.execute<ResultSetHeader>(
  //       `
  //       INSERT INTO notifications
  //       (notification, user_id, type, related_case_id, related_task_id, message)
  //       VALUES (?, ?, ?, ?, ?, ?)
  //       `,
  //       [
  //         notification,
  //         user_id,
  //         type,
  //         related_case_id ?? null,
  //         related_task_id ?? null,
  //         message,
  //       ]
  //     );

  //     return await this.findById(row.insertId.toString());
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  static async consultation(
    payload: { related_case_id: string; user_Id: string; case_concern: string },
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_Id, case_concern } = payload;

      const sqlPool = connection ?? pool;

      await sqlPool.execute(
        `
    INSERT INTO notifications (user_id, type, related_case_id, message) 
     SELECT u.id, ?, ?, ? FROM users AS u  
     WHERE u.role != 'process-server' AND u.id != ? `,
        [
          "NEW_CASE",
          related_case_id,
          `A new case for consultation “${case_concern}” has been created. `,
          user_Id,
        ]
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find notification by ID
   */
  static async findById(id: string): Promise<NotificationModel> {
    try {
      const [rows] = await pool.execute<(NotificationModel & RowDataPacket)[]>(
        `SELECT * FROM notifications WHERE id = ?`,
        [id]
      );

      if (!rows.length) throw new Error("Notification not found");

      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getAllByUser(userId: string): Promise<NotificationModel[]> {
    try {
      const [rows] = await pool.execute<(NotificationModel & RowDataPacket)[]>(
        `
        SELECT * FROM notifications 
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get unread notifications
   */
  static async getUnreadByUser(userId: string): Promise<NotificationModel[]> {
    try {
      const [rows] = await pool.execute<(NotificationModel & RowDataPacket)[]>(
        `
        SELECT * FROM notifications 
        WHERE user_id = ? AND is_read = 0
        ORDER BY created_at DESC
        `,
        [userId]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<void> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `
        UPDATE notifications 
        SET is_read = 1
        WHERE id = ?
        `,
        [id]
      );

      if (result.affectedRows === 0) throw new Error("Notification not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Mark all notifications for this user as read
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      await pool.execute(
        `
        UPDATE notifications 
        SET is_read = 1
        WHERE user_id = ?
        `,
        [userId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a notification by ID
   */
  static async deleteById(id: string): Promise<void> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `
        DELETE FROM notifications 
        WHERE id = ?
        `,
        [id]
      );

      if (result.affectedRows === 0) throw new Error("Notification not found");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete all notifications for a user
   */
  static async deleteAllByUser(userId: string): Promise<void> {
    try {
      await pool.execute(
        `
        DELETE FROM notifications 
        WHERE user_id = ?
        `,
        [userId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
