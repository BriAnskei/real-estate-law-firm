import express from "express";
import { HearingCancellationController } from "../controller/hearing_cancellation.contoller.js";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const hearingCancellationRouter = express.Router();

hearingCancellationRouter.get(
  "/find/:hearing_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingCancellationController.findById)
);

export default hearingCancellationRouter;
