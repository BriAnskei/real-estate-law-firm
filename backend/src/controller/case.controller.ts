import { Request, Response } from "express";
import { CaseSerice } from "../service/case.service.js";

export class CaseController {
  static async addNewCase(req: Request, res: Response): Promise<any> {
    const { caseData, clientData } = req.body;

    const newCaseData = await CaseSerice.handleNewCase({
      caseData,
      clientData,
    });

    res.json({ success: true, data: newCaseData });
  }

  static async getAllUnpaid(req: Request, res: Response): Promise<any> {
    const page = Number(req.query.page) || 1;

    const unpaidPaginatedCases = await CaseSerice.getAllNoPay({
      page,
    });

    res.json({ success: true, data: unpaidPaginatedCases });
  }
}
