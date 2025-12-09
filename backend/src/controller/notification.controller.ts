import { Request, Response } from "express";
import { NotificationService } from "../service/notification.service.js";
import { AuthRequest } from "../types/express.types.js";

export class NotificationController {
  static async fetchByUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId;
    const response = await NotificationService.getAllByUser(userId!);

    res.json({ success: true, data: response });
  }
}
