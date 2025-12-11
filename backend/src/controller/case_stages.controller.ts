import { Request, Response } from "express";
import { CaseStageService } from "../service/case_stage.service.js";
import { AuthRequest } from "../types/express.types.js";

export class CaseStagesController {
  static async getByCaseId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await CaseStageService.getAllCaseStages(id);

    res.json({ success: true, data: response });
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    const { id, caseId, stage_name } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const response = await CaseStageService.processCaseStageUpdate({
      stageId: id,
      caseId,
      status,
      stage_name,
      userId: userId!,
    });

    res.json({ ...response });
  }

  static async setSelectedHearingSched(
    req: Request,
    res: Response
  ): Promise<void> {
    const { case_id } = req.params;
    const { hearing_id } = req.body;

    const response = await CaseStageService.processSelectHearingSched({
      case_id,
      hearingId: hearing_id,
    });

    res.json({ ...response });
  }
}
