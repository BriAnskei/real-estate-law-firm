import exress from "express";
import { CaseLogContoller } from "../controller/case_log.controller.js";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const caseLogRoute = exress.Router();

caseLogRoute.get(
  "/get/:caseId",
  asyncHandler(authMiddleware),
  asyncHandler(CaseLogContoller.fetchAll)
);

export default caseLogRoute;
