import { Request, Response } from "express";
import { HearingCancellationService } from "../service/hearing_cancellation.service.js";

export class HearingCancellationController {
  static async findById(req: Request, res: Response): Promise<void> {
    const { hearing_id } = req.params;

    const response = await HearingCancellationService.findByHearingId(
      hearing_id
    );

    res.json({ success: true, data: response });
  }
}
