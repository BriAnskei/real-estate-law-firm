import { Request, Response } from "express";
import { HearingService } from "../service/hearing.service.js";
import { AuthRequest } from "../types/express.types.js";

export class HearingController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    const { case_id } = req.params;
    const { type, scheduled_date } = req.body;

    const response = await HearingService.add({
      case_id,
      type,
      scheduled_date,
    });

    res.json({
      success: true,
      data: response,
      message: "New hearing has been added",
    });
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    const { case_id } = req.params;

    const response = await HearingService.getAllByCaseId(case_id);

    res.json({
      success: true,
      data: response,
    });
  }

  static async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await HearingService.findById(id);

    res.json({
      success: true,
      data: response,
    });
  }

  /**
   * Update the hearing type
   */
  static async updateType(req: Request, res: Response): Promise<void> {
    const { hearing_id } = req.params;
    const { newType } = req.body;

    await HearingService.updateType({
      id: hearing_id,
      newType,
    });

    res.json({
      success: true,
      message: "Hearing has been updated",
    });
  }

  /**
   * Postponse the hearing schedule
   */
  static async postponeHearing(req: Request, res: Response): Promise<void> {
    const { hearing_id } = req.params;
    const { old_date, new_date, reason } = req.body;

    await HearingService.processHearingPostponement({
      hearing_id,
      old_date,
      new_date,
      reason,
    });

    res.json({ success: true });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { hearing_id } = req.params;

    await HearingService.deleteById(hearing_id);

    res.json({
      success: true,
      message: "Hearing has been deleted",
    });
  }

  static async deleteAllByCase(req: Request, res: Response): Promise<void> {
    const { case_id } = req.params;

    await HearingService.deleteAllByCaseId(case_id);

    res.json({
      success: true,
      message: "All hearings for this case were deleted",
    });
  }
}
