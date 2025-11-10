import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/req.validator.js";
import authRequestSchema from "../schema/auth.request.schema.js";

const authRouter = Router();

authRouter.post("/signup", validateRequest(authRequestSchema.signupSchema), authController.signup)
authRouter.post("/login", validateRequest(authRequestSchema.loginSchema), authController.login)
authRouter.post("/google", authController.googleLogin)
authRouter.post("/logout", authController.logout)
authRouter.post("/verify-email", validateRequest(authRequestSchema.verifyOtpSchema), authController.verifyEmail)
authRouter.post("/validate-email-for-reset-password", authController.validateEmailForReset)
authRouter.post("/validate-otp", authController.validateOtp)
authRouter.post("/reset-password", authController.resetPassword)
authRouter.post("/resend-otp", authController.sendOtp)

export default authRouter;