import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { taskController } from "../controller/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const taskRoute = express.Router();

taskRoute.post(
  "/create/:stage_name/:case_stage_id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.create)
);

taskRoute.get(
  "/get/:stage_name/:case_stage_id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.getTasks)
);

taskRoute.get(
  "/find/:id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.findOneById)
);

taskRoute.delete(
  "/rollback/:id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.findOneById)
);

export default taskRoute;
