import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { AuthController } from "../controller/auth.controller.js";
import { verifyProviderToken } from "../middleware/firebase.middleware.js";
import { CaseStagesController } from "../controller/case_stages.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const caseStageRoute = express.Router();

caseStageRoute.get(
  "/get/:id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseStagesController.getByCaseId)
);

caseStageRoute.patch(
  "/update/:id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseStagesController.updateStatus)
);

export default caseStageRoute;
