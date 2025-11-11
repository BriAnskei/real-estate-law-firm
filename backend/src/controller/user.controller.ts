import { Request, Response } from "express";
import { UsersService } from "../service/user.service.js";
import { AuthRequest } from "../types/express.types.js";

export class UserController {
  static async fetchUserById(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const response = await UsersService.findUserById(userId!);

    res.json({ ...response });
  }

  static async fetchAll(_: Request, res: Response) {
    const allUsers = await UsersService.fetchAllUsers();

    res.json({ success: true, data: allUsers });
  }

  static async filter(req: AuthRequest, res: Response) {
    const { filterInput } = req.query;

    const filterResponse = await UsersService.findByEmailOrName(
      filterInput as string
    );
    res.json({ success: true, data: filterResponse });
  }
}
