import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { CaseController } from "../controller/case.controller.js";

const caseRoute = express.Router();

caseRoute.post(
  "/create",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.addNewCase)
);

caseRoute.get(
  "/get/active",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.getActive)
);

caseRoute.get(
  "/filter/active",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.filterActive)
);

caseRoute.get(
  "/get/unpaid",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.getPending)
);

caseRoute.get(
  "/find/:id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.findById)
);

caseRoute.get(
  "/find/stage/:case_stage_id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.fetchByStageId)
);

caseRoute.patch(
  "/update/:id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.update)
);

caseRoute.patch(
  "/mark/ongoing/:id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.markOngoing)
);

caseRoute.delete(
  "/delete/:id",
  asyncHandler(authMiddleware),
  asyncHandler(CaseController.delete)
);

export default caseRoute;
