import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { HearingController } from "../controller/hearing.contoller.js";

const hearingRoute = express.Router();

hearingRoute.post(
  "/create/:case_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.create)
);

hearingRoute.get(
  "/get/:case_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.getAll)
);

hearingRoute.get(
  "/find/:id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.findById)
);

hearingRoute.get(
  "/filter/:case_id",
  // asyncHandler(authMiddleware),
  asyncHandler(HearingController.filter)
);

hearingRoute.patch(
  "/update/:hearing_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.updateType)
);

hearingRoute.patch(
  "/postpone/:hearing_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.postponeHearing)
);

hearingRoute.patch(
  "/cancel/:hearing_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.cancelHearing)
);

hearingRoute.patch(
  "/complete/:hearing_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.completeHearing)
);

hearingRoute.delete(
  "/delete/:hearing_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.delete)
);

hearingRoute.delete(
  "/delete-all/:case_id",
  asyncHandler(authMiddleware),
  asyncHandler(HearingController.deleteAllByCase)
);

export default hearingRoute;
