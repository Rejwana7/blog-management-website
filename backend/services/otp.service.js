import { OtpVerification, User } from "../models/association.js";
import { generateOtp, hashOtp } from "../utils/otp.utils.js";
import { sendOtpEmail } from "../utils/mailer.js";

export const createAndSendOtp = async (userId, email) => {
    const normalizedEmail = email.trim().toLowerCase();

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    const isAdmin = normalizedEmail === adminEmail;

    let otp;
    let otpDelivery;

    
    // ADMIN OTP
    
    if (isAdmin) {

        // Local development
        if (process.env.NODE_ENV === "development") {
            otp = process.env.DEV_OTP;
            otpDelivery = "development";

            if (!/^\d{4}$/.test(otp || "")) {
                const error = new Error(
                    "DEV_OTP must be exactly 4 digits."
                );

                error.statusCode = 500;
                throw error;
            }
        }

        // Production / Render
        else if (process.env.NODE_ENV === "production") {
            otp = process.env.ADMIN_OTP;
            otpDelivery = "admin";

            if (!/^\d{4}$/.test(otp || "")) {
                const error = new Error(
                    "ADMIN_OTP must be exactly 4 digits."
                );

                error.statusCode = 500;
                throw error;
            }
        }

        // Invalid environment
        else {
            const error = new Error(
                "Invalid NODE_ENV."
            );

            error.statusCode = 500;
            throw error;
        }
    }

   
    // NORMAL USER OTP
   
    else {
        // Random OTP for normal users
        otp = generateOtp();
        otpDelivery = "email";
    }

    
    // HASH OTP
   

    const otpHash = hashOtp(otp);

    // OTP expires in 2 minutes
    const expiresAt = new Date(
        Date.now() + 2 * 60 * 1000
    );

    // Remove previous OTP
    await OtpVerification.destroy({
        where: { userId }
    });

    // Save new OTP
    await OtpVerification.create({
        userId,
        otpHash,
        expiresAt
    });

    // Send email ONLY for normal users
    if (otpDelivery === "email") {
        await sendOtpEmail(email, otp);
    }

    return {
        otpDelivery
    };
};



// VERIFY OTP


export const verifyOtpService = async (email, otp) => {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        where: {
            email: normalizedEmail
        }
    });

    if (!user) {
        const error = new Error("User not found.");

        error.statusCode = 404;
        throw error;
    }

    const otpRecord = await OtpVerification.findOne({
        where: {
            userId: user.id
        },
        order: [
            ["createdAt", "DESC"]
        ]
    });

    if (!otpRecord) {
        const error = new Error("OTP not found.");

        error.statusCode = 400;
        throw error;
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {

        await otpRecord.destroy();

        const error = new Error("OTP expired.");

        error.statusCode = 400;
        throw error;
    }

    // Hash received OTP
    const otpHash = hashOtp(otp);

    // Check OTP
    if (otpHash !== otpRecord.otpHash) {

        otpRecord.attempts += 1;

        await otpRecord.save();

        if (otpRecord.attempts >= 5) {

            await otpRecord.destroy();

            const error = new Error(
                "Too many incorrect OTP attempts."
            );

            error.statusCode = 429;
            throw error;
        }

        const error = new Error("Invalid OTP.");

        error.statusCode = 400;
        throw error;
    }

    // OTP correct
    await otpRecord.destroy();

    return user;
};