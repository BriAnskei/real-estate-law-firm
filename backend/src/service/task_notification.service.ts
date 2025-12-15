import { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";

export class TaskNotificationService {
  /**
   * Create notification tracking row for a task
   * Call this right after creating a task
   */
  static async add(taskId: number, connection: PoolConnection): Promise<void> {
    try {
      await connection.execute(
        `
        INSERT INTO task_notifications (task_id)
        VALUES (?)
        `,
        [taskId]
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if 3-day notification was already sent
   */
  static async is3DaysNotified(taskId: number): Promise<boolean> {
    try {
      const [rows] = await pool.execute<
        (RowDataPacket & { notified_3days: number })[]
      >(
        `
        SELECT notified_3days
        FROM task_notifications
        WHERE task_id = ?
        `,
        [taskId]
      );

      if (rows.length === 0) {
        return false;
      }

      return Boolean(rows[0].notified_3days);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark 3-day notification as sent
   */
  static async mark3DaysNotified(taskId: number): Promise<void> {
    try {
      await pool.execute(
        `
        UPDATE task_notifications
        SET notified_3days = TRUE
        WHERE task_id = ?
        `,
        [taskId]
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if 3-day notification was already sent
   */
  static async is5DaysNotified(taskId: number): Promise<boolean> {
    try {
      const [rows] = await pool.execute<
        (RowDataPacket & { notified_3days: number })[]
      >(
        `
        SELECT notified_5days
        FROM task_notifications
        WHERE task_id = ?
        `,
        [taskId]
      );

      if (rows.length === 0) {
        return false;
      }

      return Boolean(rows[0].notified_5days);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark 5-day notification as sent
   */
  static async mark5DaysNotified(taskId: number): Promise<void> {
    try {
      await pool.execute(
        `
        UPDATE task_notifications
        SET notified_5days = TRUE
        WHERE task_id = ?
        `,
        [taskId]
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Manual delete (optional if ON DELETE CASCADE exists)
   */
  static async delete(
    taskId: number,
    connection: PoolConnection
  ): Promise<void> {
    await connection.execute(
      `
      DELETE FROM task_notifications
      WHERE task_id = ?
      `,
      [taskId]
    );
  }
}
