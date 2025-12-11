import { Request, Response } from "express";
import { NotificationService } from "../service/notification.service.js";
import { AuthRequest } from "../types/express.types.js";

export class NotificationController {
  static async fetchByUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId;
    const response = await NotificationService.getAllByUser(userId!);

    res.json({ success: true, data: response });
  }

  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    await NotificationService.markAsRead(req.params.id);

    res.json({ success: true });
  }

  static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    await NotificationService.markAllAsRead(req.userId!);

    res.json({ success: true });
  }
}
