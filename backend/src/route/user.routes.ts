import express from "express";
import asyncHandler from "../util/asyncHandler.js";

import { UserController } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get(
  "/get",
  asyncHandler(authMiddleware),
  asyncHandler(UserController.fetchAll, "UserController.fetchAll")
);

userRouter.get("/get/id/:id", asyncHandler(UserController.feetchById));

userRouter.get(
  "/get/role/:role",
  asyncHandler(authMiddleware),
  asyncHandler(UserController.fetchByRole, "UserController.fetchByRole")
);

userRouter.get(
  "/filter",
  asyncHandler(authMiddleware),
  asyncHandler(UserController.filter, "UserController.filter")
);

userRouter.get(
  "/current",
  asyncHandler(authMiddleware),
  asyncHandler(
    UserController.fetchCurrentUser,
    "UserController.fetchCurrentUser"
  )
);

export default userRouter;
