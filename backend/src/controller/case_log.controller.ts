import { Request, Response } from "express";
import { CaseLogService } from "../service/case_log.service.js";

export class CaseLogContoller {
  static async fetchAll(req: Request, res: Response): Promise<void> {
    const { caseId } = req.params;

    const response = await CaseLogService.fetchAllByCaseId(caseId);

    res.json({ success: true, data: response });
  }
}
