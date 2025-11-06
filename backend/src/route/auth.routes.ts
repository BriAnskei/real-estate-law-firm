import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { AuthController } from "../controller/auth.controller.js";
import { verifyProviderToken } from "../middleware/firebase.middleware.js";

const authRouter = express.Router();

authRouter.post(
  "/signin",
  asyncHandler(AuthController.signIn, "AuthController.signIn")
);

authRouter.get(
  "/signup/google",
  asyncHandler(verifyProviderToken),
  asyncHandler(AuthController.googleSignup)
);

authRouter.post(
  "/refresh",
  asyncHandler(AuthController.refreshToken, "AuthController.refreshToken")
);

export default authRouter;
