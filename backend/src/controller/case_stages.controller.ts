import { Request, Response } from "express";
import { CaseStageService } from "../service/case_stage.service.js";

export class CaseStagesController {
  static async getByCaseId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await CaseStageService.getAllCaseStages(id);

    res.json({ success: true, data: response });
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;
    const response = await CaseStageService.updateStatus({ id, status });

    res.json({ ...response });
  }
}
