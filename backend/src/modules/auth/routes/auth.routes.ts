import { RequestHandler, Router } from "express";
import { authController } from "../../../container/auth.container";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { validateRequest } from "../../../middleware/validateRequest";
import { asyncHandler } from "../../../middleware/asyncHandler";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
});

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

router.post("/refresh-token", asyncHandler(authController.refreshToken));

router.post("/logout", asyncHandler(authController.logout));

router.get(
  "/me",
  authenticate as unknown as RequestHandler,
  asyncHandler(authController.getMe),
);

export default router;
