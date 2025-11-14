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
  "/get/unpaid",

  asyncHandler(CaseController.getAllUnpaid)
);

export default caseRoute;
