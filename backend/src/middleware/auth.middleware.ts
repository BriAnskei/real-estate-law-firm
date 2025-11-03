import { NextFunction, Response } from "express";
import { TokenUtils } from "../util/token.util.js";
import { AuthRequest } from "../types/express.types.js";

export const authMiddleware = async (
  req: AuthRequest,
  _: Response,
  next: NextFunction
) => {
  const token = req.headers.token as string;
  const decodedToken = TokenUtils.decodeToken(token);
  req.userId = decodedToken;
  next();
};
