import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { AuthController } from "../controller/auth.controller.js";
import { verifyProviderToken } from "../middleware/firebase.middleware.js";

const authRouter = express.Router();

authRouter.post(
  "/signin",
  asyncHandler(AuthController.signIn, "AuthController.signIn")
);

authRouter.post(
  "/signin/google",
  asyncHandler(verifyProviderToken),
  asyncHandler(AuthController.googleSignin)
);

authRouter.get(
  "/signup/google",
  asyncHandler(verifyProviderToken),
  asyncHandler(AuthController.googleSignup)
);

authRouter.post("/signout", asyncHandler(AuthController.onSignOut));

authRouter.post(
  "/refresh",
  asyncHandler(AuthController.refreshToken, "AuthController.refreshToken")
);

export default authRouter;
