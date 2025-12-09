import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { TaskReviewController } from "../controller/task_review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const taskReviewRoute = express.Router();

taskReviewRoute.post(
  "/add/:task_id",
  asyncHandler(authMiddleware),
  asyncHandler(TaskReviewController.addNewReview)
);

taskReviewRoute.post(
  "/executed/:task_id",
  asyncHandler(authMiddleware),
  asyncHandler(TaskReviewController.executedReview)
);

taskReviewRoute.get(
  "/get/:task_id",
  asyncHandler(authMiddleware),
  asyncHandler(TaskReviewController.fetchAll)
);

taskReviewRoute.get(
  "/find/:id",
  asyncHandler(authMiddleware),
  asyncHandler(TaskReviewController.findOne)
);

export default taskReviewRoute;
