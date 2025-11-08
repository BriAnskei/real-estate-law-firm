import express from "express";
import asyncHandler from "../util/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { RegistrationRequestService } from "../service/registration_request.service.js";
import { RegistrationController } from "../controller/registration.controller.js";

const registrationRouter = express.Router();

registrationRouter.get(
  "/get",
  asyncHandler(authMiddleware),
  asyncHandler(RegistrationController.fetchAllRegistration)
);

registrationRouter.get(
  "/filter",
  asyncHandler(authMiddleware),
  asyncHandler(RegistrationController.filter)
);

registrationRouter.post(
  "/approve",
  asyncHandler(authMiddleware),
  asyncHandler(RegistrationController.approveRegistration)
);

registrationRouter.post(
  "/reject",
  asyncHandler(authMiddleware),
  asyncHandler(RegistrationController.rejectRegistrationRequest)
);

export default registrationRouter;
