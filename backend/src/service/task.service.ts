import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import { taskModel, TaskType } from "../model/taskModel.js";
import { TaskFileService } from "./task_file.service.js";
import { PoolConnection } from "mysql2/promise";
import { FileType } from "../model/task_files.model.js";
import { UsersService } from "./user.service.js";
import { CaseService } from "./case.service.js";
import { NotificationService } from "./notification.service.js";
import { CaseStageService } from "./case_stage.service.js";
import { TaskReviewService } from "./task_review.service.js";
import { TaskNotificationService } from "./task_notification.service.js";
import { CaseLogService } from "./case_log.service.js";

const TASK_SELECT_BASE = `
    SELECT 
        t.*,
        CONCAT(u1.firstName, ' ', u1.lastName) AS assigner_name,
        CONCAT(u2.firstName, ' ', u2.lastName) AS assignee_name
    FROM tasks t
    LEFT JOIN users u1 ON u1.id = t.assign_by
    LEFT JOIN users u2 ON u2.id = t.assign_to
`;

const PROCESS_SERVER_TASK_SELECT_BASE = `
  SELECT 
        t.*,
        CONCAT(u1.firstName, ' ', u1.lastName) AS assigner_name,
        CONCAT(u2.firstName, ' ', u2.lastName) AS assignee_name,
        c.concern AS case_concern,
        cl.client_name AS client_name
      FROM tasks t
      LEFT JOIN users u1 ON u1.id = t.assign_by
      LEFT JOIN users u2 ON u2.id = t.assign_to
      LEFT JOIN case_stages cs ON cs.id = t.case_stage_id
      LEFT JOIN cases c ON c.id = cs.case_id
      LEFT JOIN client cl ON cl.id = c.client_id
    
`;

// global dashboard
const DASHBOARD_SELECT_FIELDS = `
SELECT
  t.title      AS task_title,
  t.stage_name,
  c.concern    AS case_concern,
  t.due_date
`;

type DashboardReturnTypes = {
  task_title: string;
  stage_name: string;
  case_concern: string;
  due_date: string;
};

export class TaskService {
  static async add(payload: {
    taskData: taskModel;
    taskDetials: {
      assignerName: string;
      case_concern: string;
      case_id: string;
    };
  }): Promise<TaskType> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { taskData, taskDetials } = payload;

      const [row] = await connection.execute<ResultSetHeader>(
        `
      INSERT INTO tasks
      (case_stage_id, stage_name, title, description, assign_by, assign_to, due_date, hearing_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          taskData.case_stage_id,
          taskData.stage_name,
          taskData.title,
          taskData.description,
          taskData.assign_by,
          taskData.assign_to,
          taskData.due_date,
          taskData.hearing_id,
        ]
      );

      // add log
      await CaseLogService.create(
        {
          case_id: Number(taskDetials.case_id),
          user_id: Number(taskData.assign_by),
          type: "task_created",
          title: "Task Added",
          description: taskData.title,
          metadata: {
            task_title: taskData.title,
            stage_name: taskData.stage_name,
          },
        },
        connection
      );

      await TaskNotificationService.add(row.insertId, connection);

      // dont add a notification if the assign assgin to himself
      if (Number(taskData.assign_by) !== Number(taskData.assign_to)) {
        await NotificationService.newTaskNotification(
          {
            user_id: taskData.assign_to,
            related_case_id: taskDetials.case_id,
            related_task_id: row.insertId.toString(),
            task_title: taskData.title,

            case_concern: taskDetials.case_concern,
            assignerName: taskDetials.assignerName,
          },
          connection
        );
      }
      await connection.commit();
      return await this.findById({ id: row.insertId.toString() });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   *
   * for admin dashboard
   */
  static async getAllDueTask(): Promise<number> {
    try {
      const [res] = await pool.execute<
        ({
          due_tasks: number;
        } & ResultSetHeader)[]
      >(`SELECT COUNT(*) AS due_tasks
                FROM tasks
                WHERE status = 'pending'
              AND due_date IS NOT NULL
              AND due_date <= CURDATE();
`);

      return res[0].due_tasks;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Global dashboard fetcher
   */

  static async countPendingTasksByUser(userId: string): Promise<number> {
    try {
      const [res] = await pool.execute<
        ({
          pending_count: number;
        } & ResultSetHeader)[]
      >(
        `SELECT COUNT(*) AS pending_count
      FROM tasks
      WHERE
      assign_to = ?
      AND status = 'pending'
`,
        [userId]
      );

      return res[0].pending_count;
    } catch (error) {
      throw error;
    }
  }

  static async fetchOverDueTaskByUser(
    userId: string
  ): Promise<DashboardReturnTypes[]> {
    try {
      const [rows] = await pool.execute<
        (DashboardReturnTypes & RowDataPacket)[]
      >(
        `
      ${DASHBOARD_SELECT_FIELDS} FROM tasks t
    INNER JOIN case_stages cs ON cs.id = t.case_stage_id
    INNER JOIN cases c ON c.id = cs.case_id
    WHERE 
      t.assign_to = ? AND
      t.status = 'pending'
      AND t.due_date IS NOT NULL
      AND t.due_date < CURDATE()
    ORDER BY t.due_date ASC
      `,
        [userId]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async fetchTasksDueIn3Days(
    userId: string
  ): Promise<DashboardReturnTypes[]> {
    try {
      const [rows] = await pool.execute<
        (DashboardReturnTypes & RowDataPacket)[]
      >(
        `
      ${DASHBOARD_SELECT_FIELDS}   FROM tasks t
    INNER JOIN case_stages cs ON cs.id = t.case_stage_id
    INNER JOIN cases c ON c.id = cs.case_id
    WHERE 
      t.assign_to = ? AND
      t.status = 'pending'
      AND t.due_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    ORDER BY t.due_date ASC
      `,
        [userId]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async fetchTasksDueIn5Days(
    userId: string
  ): Promise<DashboardReturnTypes[]> {
    try {
      const [rows] = await pool.execute<
        (DashboardReturnTypes & RowDataPacket)[]
      >(
        `
      ${DASHBOARD_SELECT_FIELDS}  FROM tasks t
    INNER JOIN case_stages cs ON cs.id = t.case_stage_id
    INNER JOIN cases c ON c.id = cs.case_id
    WHERE 
      t.status = 'pending'
      AND t.due_date = DATE_ADD(CURDATE(), INTERVAL 5 DAY)
    ORDER BY t.due_date ASC
      `,
        [userId]
      );

      return rows;
    } catch (error) {
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

  /**
   * mainly used in process server role
   */
  static async getAllByAssignTo(
    userId: string
  ): Promise<(TaskType & { client_name: string; case_concern: string })[]> {
    try {
      const [rows] = await pool.execute<
        ((TaskType & { client_name: string; case_concern: string }) &
          RowDataPacket)[]
      >(
        `
      ${PROCESS_SERVER_TASK_SELECT_BASE} WHERE t.assign_to = ? AND t.status = 'pending'
      ORDER BY t.created_at DESC
        `,
        [userId]
      );

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async searchProcessServerTasks({
    userId,
    keyword,
  }: {
    userId: string;
    keyword: string;
  }): Promise<(TaskType & { client_name: string; case_concern: string })[]> {
    try {
      const searchTerm = `%${keyword}%`;

      const [rows] = await pool.execute<
        ((TaskType & { client_name: string; case_concern: string }) &
          RowDataPacket)[]
      >(
        `
        ${PROCESS_SERVER_TASK_SELECT_BASE}
        WHERE t.assign_to = ?
        AND (
          t.title LIKE ?
          OR c.concern LIKE ?
          OR cl.client_name LIKE ?
        ) AND t.status = 'pending'
        ORDER BY t.created_at DESC
      `,
        [userId, searchTerm, searchTerm, searchTerm]
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

  static async findById(
    payload: {
      id: string;
      status?: string;
    },
    connection?: PoolConnection
  ): Promise<TaskType> {
    try {
      const sqlPool = connection ?? pool;

      const { id, status } = payload;

      let whereClause = "WHERE t.id = ? ";
      const values = [];

      values.push(id);

      if (status) {
        whereClause += "AND t.status = ? ";
        values.push(status);
      }

      const [rows] = await sqlPool.execute<(TaskType & RowDataPacket)[]>(
        `
         ${TASK_SELECT_BASE} ${whereClause}
        `,
        [...values]
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

  static async fetchFilterTask(payload: {
    userId: string;
    stageId: string;
    hearingId?: string;
    filter: string;
  }): Promise<taskModel[]> {
    try {
      const { userId, stageId, filter, hearingId } = payload;

      let whereClause = "WHERE t.case_stage_id = ? ";
      const param = [stageId];

      if (hearingId) {
        whereClause += "AND t.hearing_id = ? ";
        param.push(hearingId);
      }

      whereClause +=
        filter === "assigned_to_me"
          ? "AND t.assign_to = ?"
          : "AND t.assign_by = ?";

      param.push(userId);

      const [rows] = await pool.execute<(taskModel & RowDataPacket)[]>(
        `
         ${TASK_SELECT_BASE} ${whereClause}
        `,
        [...param]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * fetch the task that dues are 3-5 days from now on for notification
   */
  static async fetchAllCloseDueTask(userId: string): Promise<
    {
      id: string;
      title: string;
      case_stage_id: string;
      due_date: string;
      days_remaining: number;
    }[]
  > {
    try {
      const [rows] = await pool.execute<
        ({
          id: string;
          title: string;
          case_stage_id: string;
          due_date: string;
          days_remaining: number;
        } & RowDataPacket)[]
      >(
        ` 
 SELECT 
    id,
    title,
    case_stage_id,
    due_date,
    DATEDIFF(due_date, CURDATE()) AS days_remaining
FROM 
    tasks
WHERE
    assign_to = ?
    AND status = 'pending'
    AND DATEDIFF(due_date, CURDATE()) IN (3, 5);


        `,
        [userId]
      );

      return rows;
    } catch (error) {
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
    userId: string;
    formData: FormData;
    file_type: FileType;
    files?: Express.Multer.File[];
  }): Promise<TaskType> {
    const { id, userId, formData, file_type, files } = payload;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // process files update
      await TaskFileService.proccessUpdateSavedFiles(
        { task_id: id, file_type, files },
        connection
      );

      if (!formData || Object.keys(formData).length === 0) {
        // early commit, theres no need to update field in this case

        await connection.commit();
        return await this.findById({ id: id.toString() });
      }

      await this.update({ id, formData }, connection);

      // process for audit-log
      const taskData = await TaskService.findById({ id }, connection);
      const stageData = await CaseStageService.findById(
        taskData.case_stage_id,
        connection
      );
      const caseData = (await CaseService.findById(stageData.case_id)).data!;

      await CaseLogService.create(
        {
          case_id: Number(caseData.id!),
          user_id: Number(userId),
          type: "case_created",
          title: "Case was successfully created and filed in the system",
          metadata: {
            old_value: taskData.created_at,
            new_value: new Date().toString(),
            stage_name: stageData.stage_name,
            task_title: taskData.title,
          },
        },
        connection
      );

      await connection.commit();
      return await this.findById({ id: id.toString() });
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

  static async markTaskAsComplete(payload: {
    task_id: string;
    case_id: string;
  }): Promise<void> {
    const { task_id, case_id } = payload;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        `
      UPDATE tasks
    SET status = 'complete'
    WHERE id = ?;
  `,
        [task_id]
      );

      const taskData = await this.findById({ id: task_id }, connection);
      const stageData = await CaseStageService.findById(
        taskData.case_stage_id,
        connection
      );
      const caseData = (await CaseService.findById(stageData.case_id)).data;

      // notification for the assigneee for completion
      await NotificationService.taskCompletion(
        {
          user_id: taskData.assign_to,
          task_title: taskData.title,
          related_case_id: case_id,
          related_task_id: task_id,
          case_concern: caseData?.concern!,
          stage_name: stageData.stage_name,
        },
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();

      console.error(error);
      throw error;
    } finally {
      connection.release();
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
      await connection.beginTransaction();

      await TaskNotificationService.delete(Number(id), connection);
      await NotificationService.deleteByRelatedTaskId(id, connection);
      await TaskReviewService.deleteByTaskId(id, connection);
      await TaskFileService.delete({ taskId: id }, connection);
      await this.deleteById(id, connection);

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
