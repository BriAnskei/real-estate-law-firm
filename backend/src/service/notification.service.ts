import { Connection, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import {
  NotificationModel,
  notificationType,
} from "../model/notification.model..js";
import { PoolConnection } from "mysql2/promise";
import { UsersService } from "./user.service.js";
import { CaseService } from "./case.service.js";
import { Roles } from "../model/registration_request.model.js";
import { TaskService } from "./task.service.js";
import { CaseStageService } from "./case_stage.service.js";
import { TaskReviewService } from "./task_review.service.js";
import { HearingService } from "./hearing.service.js";
import { TaskFileService } from "./task_file.service.js";
import { TaskType } from "../model/taskModel.js";
import { TaskNotificationService } from "./task_notification.service.js";

/**
 *
 * Helper function for case related notification
 */
function caseStageLabel(stage: string) {
  const encodedStageName = {
    MANAGE_REQUIREMENTS: "Case Requirements",
    FILING_DOCS: "Legal Documents",
    HEARING: "Hearing/Case Proper",
  };

  type StageType = keyof typeof encodedStageName;

  return encodedStageName[stage as StageType];
}

export function useRoleLabel(role: Roles) {
  const encodedUserRole: Record<Roles, string> = {
    "founding-manager/admin": "Admin ",
    lawyer: "Atty.",
    paralegal: "Para.",
    "process-server": "P.Server ", // or whatever label you want
  };

  return encodedUserRole[role];
}

export class NotificationService {
  /**
   * new consultation
   */
  static async consultation(
    payload: {
      related_case_id: string;
      user_id: string;
      case_concern: string;
      client_name: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_id, case_concern, client_name } = payload;

      await this.caseRelatedNotification(
        {
          related_case_id,
          user_id,
          message: `A new case for consultation "${case_concern}" associated with client "${client_name}" has been created.`,
          type: "CASE_CONSULTATION",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  static async caseOngoing(
    payload: {
      related_case_id: string;
      user_id: string;
      case_concern: string;
      client_name: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_id, case_concern, client_name } = payload;

      await this.caseRelatedNotification(
        {
          related_case_id,
          user_id,
          message: `The case "${case_concern}" pertaining to client "${client_name}"
           has been designated as an ongoing case.`,
          type: "ONGOING_CASE",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  static async caseStageStatusRelated(
    payload: {
      related_case_id: string;
      user_id: string;
      stage_name: string;
      status: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_id, stage_name, status } = payload;

      const userData = (await UsersService.findUserById(user_id, connection))
        .data;

      const caseData = (await CaseService.findById(related_case_id, connection))
        .data;

      await this.caseRelatedNotification(
        {
          related_case_id,
          user_id,
          message: `The "${caseStageLabel(stage_name)}" stage of case "${
            caseData?.concern
          }" has been marked as "${status}" by "${useRoleLabel(
            userData?.role!
          )} ${userData?.firstName} ${userData?.lastName}".`,
          type: "CASE_STAGE_STATUS",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  static async caseCompletion(
    caseId: string,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const caseData = (await CaseService.findById(caseId, connection)).data;

      await this.caseRelatedNotification(
        {
          related_case_id: caseId,
          message: `The case "${caseData?.concern}" has completed all required procedures and is now marked as complete.`,
          type: "CASE_COMPLETION",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  // Hearing functions
  /**
   * new hearing case, part of ongoing case
   */
  static async caseNewHearing(
    payload: {
      related_case_id: string;
      user_id: string;
      hearing_type: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_id, hearing_type } = payload;

      // hearing adder
      const userData = (await UsersService.findUserById(user_id, connection))
        .data!;

      const caseData = (await CaseService.findById(related_case_id, connection))
        .data!;

      await this.caseRelatedNotification(
        {
          related_case_id,
          user_id,
          message: `A new hearing "${hearing_type}" has been sheduled on case "${
            caseData.concern
          }" by ${useRoleLabel(userData.role)}${userData.firstName} ${
            userData.lastName
          }`,
          type: "ONGOING_CASE",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  static async hearingPosponent(
    payload: { related_case_id: string; user_id: string; hearingType: string },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_id, hearingType } = payload;

      const caseData = await CaseService.findById(related_case_id, connection);

      const userData = (await UsersService.findUserById(user_id, connection))
        .data!;

      await this.caseRelatedNotification(
        {
          related_case_id,
          user_id,
          message: `Hearing schedule of "${hearingType}" has been posponed by ${useRoleLabel(
            userData.role
          )}${userData.firstName} ${userData.lastName} in the case "${
            caseData.data?.concern
          }"`,
          type: "ONGOING_CASE",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Hearing cancelation or completions function
   */
  static async hearingStatus(
    payload: {
      userId: string;
      hearingId: string;
      status?: "cancelled" | "completed";
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { userId, hearingId, status = "cancelled" } = payload;

      const hearingData = await HearingService.findById(hearingId, connection);

      const caseData = (
        await CaseService.findById(hearingData.case_id, connection)
      ).data!;

      const userData = (await UsersService.findUserById(userId, connection))
        .data!;

      await this.caseRelatedNotification(
        {
          related_case_id: caseData.id!,
          user_id: userId,
          message: `A hearing of "${hearingData.type} "scheduled on case " ${
            caseData.concern
          }" has been marked as ${status} by ${useRoleLabel(userData.role)}${
            userData.firstName
          } ${userData.lastName}`,
          type: "ONGOING_CASE",
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Notification for case related
   * notification for all users except the adder and process-servers
   */
  private static async caseRelatedNotification(
    payload: {
      related_case_id: string;
      user_id?: string; // the id that we want to ignore(sender)
      message: string;
      type: notificationType;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { related_case_id, user_id, message, type } = payload;
      const sqlPool = connection ?? pool;

      // Base filter: exclude process-server
      let whereClause = `u.role != 'process-server'`;

      // Optionally exclude a specific user (e.g., the user who triggered the action)
      if (user_id) {
        whereClause += ` AND u.id != ${sqlPool.escape(user_id)}`;
      }

      const sql = `
      INSERT INTO notifications (user_id, type, related_case_id, message)
      SELECT u.id, ?, ?, ?
      FROM users AS u
      WHERE ${whereClause}
    `;

      await sqlPool.execute(sql, [type, related_case_id, message]);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * new task
   */
  static async newTaskNotification(
    payload: {
      user_id: string; // asigneee id
      related_case_id: string;
      related_task_id: string;
      task_title: string;

      //detials
      case_concern: string;
      assignerName: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    const {
      user_id,
      related_case_id,
      related_task_id,
      case_concern,
      assignerName,
      task_title,
    } = payload;

    try {
      await this.taskRelatedNotification(
        {
          user_id,
          related_case_id,
          related_task_id,
          message: `A new task titled '${task_title}' pertaining to '${case_concern}' has been assigned to you by ${assignerName}.`,
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  static async taskCompletion(
    paylaod: {
      user_id: string; // asigneee id
      task_title: string;
      related_case_id: string;
      related_task_id: string;
      stage_name: string;
      case_concern: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const {
        user_id,
        task_title,
        related_case_id,
        related_task_id,
        stage_name,
        case_concern,
      } = paylaod;

      await this.taskRelatedNotification(
        {
          user_id,
          related_case_id,
          related_task_id,
          message: `The task ‘${task_title}’ related to case ${case_concern} under the ${caseStageLabel(
            stage_name
          )} stage is now marked as completed.`,
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Notification for assigner for assginee file uploads
   */
  static async taskFileSubmission(
    taskId: string,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const taskData = await TaskService.findById({ id: taskId }, connection);

      const stageData = await CaseStageService.findById(
        taskData.case_stage_id,
        connection
      );

      const caseData = (
        await CaseService.findById(stageData.case_id, connection)
      ).data!;

      // if isAsssgnerWhoUpload, we notify the assignee, otherwise we notify the assigner

      await this.taskRelatedNotification(
        {
          user_id: taskData.assign_by,
          related_case_id: caseData.id!,
          related_task_id: taskData.id!,
          message: `A file has been uploaded to the task "${
            taskData.title
          }" under case "${caseData.concern}" at stage "${caseStageLabel(
            stageData.stage_name
          )}".`,
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  static async taskExecuted(
    taskId: string,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const taskData = await TaskService.findById({ id: taskId }, connection);

      const stageData = await CaseStageService.findById(
        taskData.case_stage_id,
        connection
      );

      const caseData = (
        await CaseService.findById(stageData.case_id, connection)
      ).data!;

      await this.taskRelatedNotification(
        {
          user_id: taskData.assign_by,
          related_case_id: caseData.id!,
          related_task_id: taskId,
          message: `The task " ${taskData.title}" at case "${caseData.concern}" that you have assign to proccess-server has been executed and awaiting for your response`,
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  private static async taskRelatedNotification(
    payload: {
      user_id: string;
      related_case_id: string;
      related_task_id: string;
      message: string;
    },
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const { user_id, related_case_id, related_task_id, message } = payload;
      const sqlPool = connection ?? pool;

      await sqlPool.execute(
        `
          INSERT INTO notifications (user_id, type, related_case_id, related_task_id, message) 
          VALUES (?, ?, ?, ?, ?)
        `,
        [user_id, "TASK_RELATED", related_case_id, related_task_id, message]
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
   *
   * task review notification, notifies all the user that commented in the
   * task, except the commenter
   */
  static async processTaskReviewNotification(
    payload: {
      user_id: string;
      related_task_id: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { user_id, related_task_id } = payload;

      // fetch all the commenter ids
      const taskReviewers = await TaskReviewService.getAllReviewerId(
        { id: related_task_id, exceptedUserId: user_id },
        connection
      );

      const taskData = await TaskService.findById(
        { id: related_task_id },
        connection
      );

      // check if the task is assgin the one user, if so there is no need for notification
      if (taskData.assign_by === taskData.assign_to) return;

      // Include either the assignee or the assigner if one is missing.
      // At least one of them must be present to ensure the notification
      // is sent to the correct user.
      const isAssigneeExist = taskReviewers.some(
        (r) => r.reviewer_id === taskData.assign_to
      );
      const isAssignerExist = taskReviewers.some(
        (r) => r.reviewer_id === taskData.assign_by
      );

      if (!isAssigneeExist && user_id !== taskData.assign_to)
        taskReviewers.push({ reviewer_id: taskData.assign_to });

      if (!isAssignerExist && user_id !== taskData.assign_by)
        taskReviewers.push({ reviewer_id: taskData.assign_by });

      const caseStageData = await CaseStageService.findById(
        taskData.case_stage_id,
        connection
      );

      const caseData = (
        await CaseService.findById(caseStageData.case_id, connection)
      ).data;

      const userData = (await UsersService.findUserById(user_id, connection))
        .data;

      await this.addBulkTaskReviewNotification(
        {
          reviewers: taskReviewers,
          related_case_id: caseData!.id!,
          related_task_id,
          message: `A comment has been submitted by ${useRoleLabel(
            userData?.role!
          )} ${userData?.firstName} ${userData?.lastName} regarding the task "${
            taskData.title
          }" pertaining to case "${
            caseData?.concern
          }" within the "${caseStageLabel(caseStageData.stage_name)}" stage.
`,
        },
        connection
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * bulk notficiation for reviews
   */
  private static async addBulkTaskReviewNotification(
    payload: {
      reviewers: {
        reviewer_id: string;
      }[];
      related_case_id: string;
      related_task_id: string;
      message: string;
    },
    connection: PoolConnection
  ): Promise<void> {
    try {
      const { reviewers, related_case_id, related_task_id, message } = payload;

      const values = reviewers.map((uid) => [
        uid.reviewer_id,
        "TASK_RELATED",
        related_case_id,
        related_task_id,
        message,
      ]);

      await connection.query(
        `
          INSERT INTO notifications 
          (user_id, type, related_case_id, related_task_id, message)
          VALUES ?
        `,
        [values]
      );
    } catch (error) {
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
   * fetch the remainder notification task
   */
  static async fetchRemainderTaskDue(
    userId: string
  ): Promise<NotificationModel[] | undefined> {
    try {
      const closeDueTasks = await TaskService.fetchAllCloseDueTask(userId);

      if (!closeDueTasks.length) return;

      for (let closetsk of closeDueTasks) {
        // check if the notification was already send
        if (closetsk.days_remaining === 3) {
          const isAllreadyNotified =
            await TaskNotificationService.is3DaysNotified(Number(closetsk.id));
          if (isAllreadyNotified) {
            continue;
          }

          await TaskNotificationService.mark3DaysNotified(Number(closetsk.id));
        } else if (closetsk.days_remaining === 5) {
          const isAllreadyNotified =
            await TaskNotificationService.is5DaysNotified(Number(closetsk.id));
          if (isAllreadyNotified) {
            continue;
          }
          await TaskNotificationService.mark5DaysNotified(Number(closetsk.id));
        }

        const stageData = await CaseStageService.findById(
          closetsk.case_stage_id
        );
        const caseData = (await CaseService.findById(stageData.case_id)).data!;

        await this.taskRelatedNotification({
          related_case_id: caseData.id!,
          user_id: userId,
          related_task_id: closetsk.id,
          message: `Your task "${closetsk.title}" under the case "${
            caseData.concern
          }", currently at the "${caseStageLabel(
            stageData.stage_name
          )}" stage, has ${
            closetsk.days_remaining
          } days remaining before its due date.`,
        });
      }
    } catch (error) {
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

  static async deleteByRelatedTaskId(
    taskId: string,
    connection: PoolConnection
  ): Promise<void> {
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `
        DELETE FROM notifications 
        WHERE related_task_id = ?
        `,
        [taskId]
      );
    } catch (error) {
      throw error;
    }
  }

  static async deleteByRelatedCaseId(
    related_case_id: string,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const sqlPool = connection ?? pool;

      const [result] = await sqlPool.execute<ResultSetHeader>(
        `
        DELETE FROM notifications 
        WHERE related_case_id = ?
        `,
        [related_case_id]
      );
      if (result.affectedRows === 0) throw new Error("Notification not found");
    } catch (error) {
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
