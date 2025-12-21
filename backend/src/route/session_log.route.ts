import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { SessionLogController } from "../controller/session_log.controller.js";

const sessionLogRouter = express.Router();

sessionLogRouter.get("/get", asyncHandler(SessionLogController.fetch));

export default sessionLogRouter;
