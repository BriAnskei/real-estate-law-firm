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

taskRoute.post(
  "/create/:stage_name/:case_stage_id/:hearing_id",
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

taskRoute.patch(
  "/complete/:task_id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.markComplete)
);

taskRoute.get(
  "/get/:stage_name/:case_stage_id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.getTasks)
);

taskRoute.get(
  "/filter/:stageId",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.filterTask)
);

taskRoute.get(
  "/filter/hearing/:stageId/:hearingId",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.filterTask)
);

taskRoute.get(
  "/process_server/get/:assign_to",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.fetchByAssignTo)
);

taskRoute.get(
  "/process_server/search/:assign_to",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.processServerFilter)
);

taskRoute.get(
  "/get/hearing/:hearing_id/:case_stage_id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.getTasksByHearing)
);

taskRoute.get(
  "/find/:id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.findOneById)
);

taskRoute.get(
  "/find/process_server/:id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.findOneByProcessServer)
);

taskRoute.delete(
  "/rollback/:id",
  asyncHandler(authMiddleware),
  asyncHandler(taskController.rollBackDrop)
);

taskRoute.delete(
  "/delete/:case_id/:stage_name/:task_id/:file_type",
  asyncHandler(authMiddleware),
  asyncHandler(deleteTaskFolderMiddleware),
  asyncHandler(taskController.delete)
);

export default taskRoute;
