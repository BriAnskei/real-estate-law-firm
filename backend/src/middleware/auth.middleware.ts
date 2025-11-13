import { NextFunction, Response } from "express";
import { TokenUtils } from "../util/token.util.js";
import { AuthRequest } from "../types/express.types.js";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const tokenHeaders = req.headers.token as string;

  if (!tokenHeaders?.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ success: false, messgae: "No accessToken provided" });
  }

  const token = tokenHeaders.split("Bearer ")[1];

  const decodedToken = TokenUtils.decodeToken(token);
  req.userId = decodedToken;
  next();
};
