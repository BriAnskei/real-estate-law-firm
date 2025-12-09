import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { NotificationController } from "../controller/notification.controller.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/get",
  asyncHandler(authMiddleware),
  asyncHandler(NotificationController.fetchByUser)
);

export default notificationRoute;
