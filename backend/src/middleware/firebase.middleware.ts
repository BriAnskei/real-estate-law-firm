import { Response, Request, NextFunction } from "express";
import admin from "../config/firebaseAdmin.js";
import { AuthRequest } from "../types/express.types.js";

export const verifyProviderToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  const decoded = await admin.auth().verifyIdToken(idToken);
  req.user = decoded;
  next();
};
