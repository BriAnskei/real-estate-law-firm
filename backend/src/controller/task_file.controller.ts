import { Request, Response } from "express";
import { TaskFileService } from "../service/task_file.service.js";

export class TaskFileController {
  static async uploadFiles(req: Request, res: Response) {
    const { task_id, file_type } = req.params;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.json({ success: true });
    }

    await TaskFileService.createFiles({ task_id, file_type, files });

    res.json({ success: true });
  }

  static async fetchByTask(req: Request, res: Response) {
    const { task_id, file_type } = req.params;

    const response = await TaskFileService.getFileByTask({
      task_id,
      file_type,
    });

    res.json({ sucess: true, data: response });
  }
}
