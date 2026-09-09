import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generatetoken.js";
import crypto from "crypto";
import PasswordResetToken from "../models/PasswordResetToken.model.js";
import { sendResetEmail } from "../utils/mailer.js";
import {createAndSendOtp,verifyOtpService} from "./otp.service.js";
export const registerUser=async({ firstname,lastname,email, password})=>{

    const existingUser=await User.findOne({where:{email}})
    if (existingUser) {
    const error = new Error( "Email already exists." );
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword=await bcrypt.hash(password,10)
       const user=await User.create({
        firstname:firstname, 
        lastname:lastname,
        email,
        password:hashedPassword
    })
     return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isActive: user.isActive,
        role: user.role
    };

    }


 
    
export const loginUser = async (email, password) => {

    const user = await User.findOne({where: { email } });

     if (!user) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }
    if (!user.isActive) {
    const error = new Error("Your account is deactivated.");
    error.statusCode = 403;
    throw error;
  }

    const passwordMatch = await bcrypt.compare( password, user.password);
    

    if (!passwordMatch) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }
   // Send OTP
    await createAndSendOtp( user.id, user.email);

     return {
        requiresOtp: true,
        email: user.email
    };
};




export const verifyLoginOtp = async (email, otp) => {

    // 1. OTP verify
    const user = await verifyOtpService(email, otp);

    // 2.if OTP correct ,JWT generate
    const token = generateToken(user);

    // 3. Token + user data return
    return {
        token,

        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        }
    };
};

export const forgotPassword = async (email) => {
     const genericResponse = {
        message:
            "If an account exists with this email, a password reset link has been sent."
    };

    const user = await User.findOne({ where: { email }});

     if (!user) {
        return genericResponse;
    }

     if (!user.isActive) {
        return genericResponse;
    }

    // Generate random token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in DB
    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Token expiry
    const minutes = Number( process.env.RESET_TOKEN_EXPIRES_MINUTES || 15);

    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    // Save hashed token
    await PasswordResetToken.create({
        userId: user.id,
        tokenHash,
        expiresAt
    });

    // Reset link
    const resetLink =
        `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send email
    await sendResetEmail(user.email, resetLink);

    return {
        message: "Password reset link has been sent to your email."
    };
};


export const resetPassword = async (token, newPassword) => {
    // 1. Incoming token-এর hash 
    const tokenHash = crypto
          .createHash("sha256")
        .update(token)
        .digest("hex");

    // 2. from DB  token find
    const resetToken = await PasswordResetToken.findOne({
        where: { tokenHash }
    });

    if (!resetToken) {
        const error = new Error("Invalid or expired reset token.");
        error.statusCode = 400;
        throw error;
    }

    // 3. Token already used or not
    if (resetToken.usedAt !== null) {
        const error = new Error("Reset token has already been used.");
        error.statusCode = 400;
        throw error;
    }

    // 4. Token expired is or not
    if (resetToken.expiresAt < new Date()) {
        const error = new Error("Reset token has expired.");
        error.statusCode = 400;
        throw error;
    }

    // 5. User find
    const user = await User.findByPk(resetToken.userId);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    // 6. New password hash 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7. User password update
    user.password = hashedPassword;
    await user.save();

    // // 8. Token-used mark
    // resetToken.usedAt = new Date();
    // await resetToken.save();

    // 8. Invalidate ALL outstanding reset tokens
  await PasswordResetToken.update(
    {
        usedAt: new Date()
    },
    {
        where: {
            userId: user.id,
            usedAt: null
        }
    }
);

    return {
        message: "Password reset successfully."
    };
};