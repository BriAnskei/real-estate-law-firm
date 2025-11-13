import { Request, Response } from "express";
import { CaseSerice } from "../service/case.service.js";

export class CaseController {
  static async new(req: Request, res: Response): Promise<any> {
    const { newCase } = req.body;

    const newCaseData = CaseSerice.create(newCase);

    res.json({ success: true, data: newCaseData });
  }

  static async getAll(_: Request, res: Response): Promise<any> {
    const allCases = CaseSerice.getAll();

    res.json({ success: true, data: allCases });
  }
}
