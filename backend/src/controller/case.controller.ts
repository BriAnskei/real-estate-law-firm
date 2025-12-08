import { Request, Response } from "express";
import { CaseService } from "../service/case.service.js";

export class CaseController {
  static async addNewCase(req: Request, res: Response): Promise<void> {
    const { caseData, clientData } = req.body;

    const newCaseData = await CaseService.handleNewCase({
      caseData,
      clientData,
    });

    res.json({ success: true, data: newCaseData });
  }

  static async getActive(_: Request, res: Response): Promise<void> {
    const response = await CaseService.fetchActive();

    res.json({ success: true, data: response });
  }

  static async filterActive(req: Request, res: Response): Promise<void> {
    const response = await CaseService.filterActive({
      query: req.query.query as string,
      status: req.query.status as string,
    });

    res.json({ success: true, data: response });
  }

  static async getPending(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;

    const filters = {
      query: req.query.query as string,
      sortFilter: req.query.sortFilter as string,
    };

    const unpaidPaginatedCases = await CaseService.fetchCases({
      page,
      filters,
    });

    res.json({ success: true, data: unpaidPaginatedCases });
  }

  static async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await CaseService.findById(id);

    if (!response.success)
      throw new Error(response.message || "Failed to find case");

    res.json({ success: true, data: response.data });
  }

  static async fetchByStageId(req: Request, res: Response): Promise<void> {
    const { case_stage_id } = req.params;

    const response = await CaseService.getCaseDataByCaseStageId(case_stage_id);

    res.json({ success: true, data: response });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { caseUpdate, clientUpdate } = req.body;

    await CaseService.handleUpdateCaseConsultation({
      caseId: id,
      caseUpdate,
      clientUpdate,
    });
    res.json({ success: true });
  }

  static async markOngoing(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { paymentMode, promiseToPay } = req.body;

    await CaseService.setCaseAsOngiong({ id, paymentMode, promiseToPay });

    res.json({ success: true });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await CaseService.processCaseDeletion(id);

    res.json({ success: true });
  }
}
