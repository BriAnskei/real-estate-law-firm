import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { DashboardController } from "../controller/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const dashboardRoute = express.Router();

dashboardRoute.get(
  "/admin",
  asyncHandler(authMiddleware),
  asyncHandler(DashboardController.fetchAdminDashboard)
);

dashboardRoute.get(
  "/global",
  asyncHandler(authMiddleware),
  asyncHandler(DashboardController.fetchGlobalDashboard)
);

export default dashboardRoute;
