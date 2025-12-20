import { Request, Response } from "express";
import { SessionLogService } from "../service/session_log.service.js";

export class SessionLogController {
  static async fetch(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? Number(req.query.page) : undefined;

    const response = await SessionLogService.fetchSessions({
      page: page,
      filters: {
        query: req.query.query as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      },
    });

    res.json({ success: true, data: response });
  }
}
