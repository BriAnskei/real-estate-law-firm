import { Request, Response } from "express";
import { TaskService } from "../service/task.service.js";
import { AuthRequest } from "../types/express.types.js";
import { FileType } from "../model/task_files.model.js";

export class taskController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    const assign_by = req.userId as string;
    const { case_stage_id, stage_name } = req.params;
    const {
      title,
      description,
      assign_to,
      due_date,
      assignerName,
      case_concern,
      case_id,
    } = req.body;

    const hearing_id = req.params.hearing_id ?? null;

    const response = await TaskService.add({
      taskData: {
        case_stage_id,
        stage_name,
        title,
        description,
        assign_by,
        assign_to,
        due_date,
        hearing_id,
      },
      taskDetials: { assignerName, case_concern, case_id },
    });

    res.json({
      success: true,
      data: response,
      message: "New Task has been added",
    });
  }

  static async getTasks(req: Request, res: Response): Promise<void> {
    const { case_stage_id, stage_name } = req.params;

    const response = await TaskService.getAll({ case_stage_id, stage_name });

    res.json({ success: true, data: response });
  }

  static async filterTask(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId as string;
    const { stageId, hearingId } = req.params;

    const filter = req.query.filter as string;

    const response = await TaskService.fetchFilterTask({
      userId,
      stageId,
      filter,
      hearingId,
    });

    res.json({ success: true, data: response });
  }

  // process server usage
  static async fetchByAssignTo(req: Request, res: Response): Promise<void> {
    const { assign_to } = req.params;

    const response = await TaskService.getAllByAssignTo(assign_to);

    res.json({ success: true, data: response });
  }

  static async processServerFilter(req: Request, res: Response): Promise<void> {
    const response = await TaskService.searchProcessServerTasks({
      userId: req.params.assign_to,
      keyword: req.query.query as string,
    });

    res.json({ success: true, data: response });
  }

  static async getTasksByHearing(req: Request, res: Response): Promise<void> {
    const { case_stage_id, hearing_id } = req.params;

    const response = await TaskService.getAllByHearing({
      case_stage_id,
      hearing_id,
    });

    res.json({ success: true, data: response });
  }

  static async findOneById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await TaskService.findById({ id: id as string });

    res.json({ success: true, data: response });
  }

  static async findOneByProcessServer(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;

    const response = await TaskService.findById({
      id: id as string,
      status: "pending",
    });

    res.json({ success: true, data: response });
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    const { task_id, file_type } = req.params;
    const updatedFields = req.body;

    const files = req.files as Express.Multer.File[];

    const response = await TaskService.processUpdateTask({
      id: task_id,
      formData: updatedFields,
      files,
      file_type: file_type as FileType,
    });

    res.json({ success: true, data: response });
  }

  static async markComplete(req: Request, res: Response): Promise<void> {
    const { task_id } = req.params;
    const { case_id } = req.body;

    await TaskService.markTaskAsComplete({ task_id, case_id });
    res.json({ success: true });
  }

  /**
   *  adding task failure rollback
   * this will be used when the files failed to upload
   * when adding task
   */
  static async rollBackDrop(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await TaskService.deleteById(id);
    res.json({ sucess: true });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { task_id } = req.params;

    await TaskService.processTaskDeletion(task_id);

    res.json({ success: true });
  }
}
