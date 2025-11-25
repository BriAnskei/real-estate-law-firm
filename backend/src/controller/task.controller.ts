import { Request, Response } from "express";
import { TaskService } from "../service/task.service.js";
import { AuthRequest } from "../types/express.types.js";

export class taskController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    const assign_by = req.userId as string;
    const { case_stage_id, stage_name } = req.params;
    const { title, description, assign_to, due_date } = req.body;

    const response = await TaskService.add({
      case_stage_id,
      stage_name,
      title,
      description,
      assign_by,
      assign_to,
      due_date,
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

  static async findOneById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await TaskService.findById(id as string);

    res.json({ success: true, data: response });
  }
}
