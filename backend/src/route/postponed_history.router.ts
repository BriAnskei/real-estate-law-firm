import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { PostponementController } from "../controller/postponed_history.controller.js";

const postponed_historyRouter = express.Router();

postponed_historyRouter.get(
  "/get/:hearing_id",
  asyncHandler(PostponementController.getAll)
);

export default postponed_historyRouter;
