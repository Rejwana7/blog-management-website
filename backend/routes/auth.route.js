import { Router } from "express";
import { register, login,verifyOtp, forgotPasswordController,resetPasswordController } from "../controller/auth.controller.js";


const router=Router();
router.post("/register", register)
// authMiddleware: Authentication
//isAdmin: Authorization
router.post("/login",login)
router.post("/verify-otp",verifyOtp)
router.post("/forgot-password", forgotPasswordController);
router.patch("/reset-password/:token",resetPasswordController);
export default router;
