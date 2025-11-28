import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { taskController } from "../controller/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../config/multerConfig.js";
import {
  deleteFileDirectoryIfNeeded,
  deleteTaskFolderMiddleware,
} from "../middleware/file.middleware.js";

const taskRoute = express.Router();

taskRoute.post(
  "/create/:stage_name/:case_stage_id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.create)
);

taskRoute.patch(
  "/update/:case_id/:stage_name/:task_id/:file_type",
  asyncHandler(authMiddleware),
  asyncHandler(deleteFileDirectoryIfNeeded),
  upload.array("uploadedPdfFiles"),
  asyncHandler(taskController.updateTask)
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

taskRoute.delete(
  "/delete/:case_id/:stage_name/:task_id/:file_type",

  asyncHandler(deleteTaskFolderMiddleware),
  asyncHandler(taskController.delete)
);

export default taskRoute;
