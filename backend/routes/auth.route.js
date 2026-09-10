import { Router } from "express";
import { register, login,verifyOtp, forgotPasswordController,resetPasswordController } from "../controller/auth.controller.js";
import { otpRequestRateLimiter, otpVerificationRateLimiter } from "../middleware/otp-rate-limit.middleware.js";


const router=Router();
router.post("/register", register)
// authMiddleware: Authentication
//isAdmin: Authorization
router.post("/login", otpRequestRateLimiter, login)
router.post("/verify-otp", otpVerificationRateLimiter, verifyOtp)
router.post("/forgot-password", forgotPasswordController);
router.patch("/reset-password/:token",resetPasswordController);
export default router;
