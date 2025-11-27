import { Request, Response } from "express";
import { UsersService } from "../service/user.service.js";
import { AuthRequest } from "../types/express.types.js";
import { Roles } from "../model/registration_request.model.js";

export class UserController {
  static async fetchCurrentUser(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const response = await UsersService.findUserById(userId!);

    res.json({ ...response });
  }

  static async feetchById(req: Request, res: Response) {
    const { id } = req.params;

    const response = await UsersService.findUserById(id!);

    res.json({ ...response });
  }

  static async fetchAll(_: Request, res: Response) {
    const allUsers = await UsersService.fetchAllUsers();

    res.json({ success: true, data: allUsers });
  }

  static async fetchByRole(req: Request, res: Response) {
    const { role } = req.params;

    const response = await UsersService.ftechByRole(role as Roles);

    res.json({ success: true, data: response });
  }

  static async filter(req: AuthRequest, res: Response) {
    const { filterInput } = req.query;

    const filterResponse = await UsersService.findByEmailOrName(
      filterInput as string
    );
    res.json({ success: true, data: filterResponse });
  }
}
