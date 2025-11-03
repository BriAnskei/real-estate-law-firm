import { Request, Response } from "express";
import { UsersService } from "../service/user.service.js";
import { AuthRequest } from "../types/express.types.js";

export class UserController {
  static async fetchUserById(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const response = await UsersService.findUserById(userId!);

    res.json({ ...response });
  }
}
