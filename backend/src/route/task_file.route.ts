import exress from "express";
import { upload } from "../config/multerConfig.js";
import { TaskFileController } from "../controller/task_file.controller.js";
import asyncHandler from "../util/asyncHandler.js";

const taskFileRoute = exress.Router();

taskFileRoute.post(
  "/upload/:task_id/:file_type",
  upload.array("uploadedPdfFiles"),
  asyncHandler(TaskFileController.uploadFiles)
);

taskFileRoute.get(
  "/get/:task_id/:file_type",
  asyncHandler(TaskFileController.fetchByTask)
);

export default taskFileRoute;
