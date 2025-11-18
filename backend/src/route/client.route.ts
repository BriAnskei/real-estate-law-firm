import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ClientController } from "../controller/client.controllet.js";

const clientRoute = express.Router();

clientRoute.get(
  "/find/:id",
  asyncHandler(authMiddleware),
  asyncHandler(ClientController.findById)
);

clientRoute.get(
  "/get",
  asyncHandler(authMiddleware),
  asyncHandler(ClientController.fetchAll)
);

clientRoute.get(
  "/search",

  asyncHandler(ClientController.search)
);

clientRoute.delete(
  "/delete/:id",
  asyncHandler(authMiddleware),
  asyncHandler(ClientController.delete)
);

export default clientRoute;
