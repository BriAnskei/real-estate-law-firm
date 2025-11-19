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

  static async getAllNoPay(req: Request, res: Response): Promise<void> {
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

    await CaseService.markAsOngoing({ id, paymentMode, promiseToPay });

    res.json({ success: true });
  }

  static async fetchAll(_: Request, res: Response): Promise<void> {
    const response = await CaseService.fetchAllOngoing();

    res.json({ success: true, data: response });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await CaseService.deleteCaseById(id);

    res.json({ success: true });
  }
}
