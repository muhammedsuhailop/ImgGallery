import { Router } from "express";
import { authController } from "../../../container/auth.container";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/auth.validation";
import { validateRequest } from "../../../middleware/validateRequest";
import { asyncHandler } from "../../../middleware/asyncHandler";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  asyncHandler(authController.refreshToken),
);

router.post(
  "/logout",
  validateRequest(refreshTokenSchema),
  asyncHandler(authController.logout),
);

export default router;
