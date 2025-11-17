import { Request, Response } from "express";
import { ClientService } from "../service/client.service.js";

export class ClientController {
  static async findById(req: Request, res: Response) {
    const { id } = req.params;

    const response = await ClientService.findById(id);

    res.json({ ...response });
  }

  static async fetchAll(req: Request, res: Response) {
    const response = await ClientService.getAll();

    res.json({ success: true, data: response });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await ClientService.delete(id);

    res.json({ success: true, message: "Client successfully deleted" });
  }
}
