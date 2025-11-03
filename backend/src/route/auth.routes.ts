import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { AuthController } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/signin",
  asyncHandler(AuthController.signIn, "AuthController.signIn")
);

export default authRouter;
