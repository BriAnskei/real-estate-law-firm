import exress from "express";
import { upload } from "../config/multerConfig.js";
import { TaskFileController } from "../controller/task_file.controller.js";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteFileDirectoryIfNeeded } from "../middleware/file.middleware.js";

const taskFileRoute = exress.Router();

taskFileRoute.post(
  "/upload/:case_id/:stage_name/:task_id/:file_type",
  asyncHandler(deleteFileDirectoryIfNeeded),
  upload.array("uploadedPdfFiles"),
  asyncHandler(TaskFileController.uploadFiles)
);

taskFileRoute.get(
  "/get/:task_id/:file_type",
  asyncHandler(authMiddleware),
  asyncHandler(TaskFileController.fetchByTask)
);

export default taskFileRoute;
