import { Request, Response } from "express";
import { PostponementService } from "../service/postponed_hearing.service.js";

export class PostponementController {
  /**
   * Get all postponement records for a specific hearing
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    const { hearing_id } = req.params;

    const response = await PostponementService.getAllByHearingId(hearing_id);

    res.json({
      success: true,
      data: response,
    });
  }
}
