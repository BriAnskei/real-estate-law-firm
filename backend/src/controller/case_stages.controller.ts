import { Request, Response } from "express";
import { CaseStageService } from "../service/case_stage.service.js";

export class CaseStagesController {
  static async getByCaseId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await CaseStageService.getAllCaseStages(id);

    res.json({ success: true, data: response });
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    const { id, caseId, stage_name } = req.params;
    const { status } = req.body;
    const response = await CaseStageService.processCaseStageUpdate({
      stageId: id,
      caseId,
      status,
      stage_name,
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
