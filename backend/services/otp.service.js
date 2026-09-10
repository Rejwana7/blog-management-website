
import {  OtpVerification,  User} from "../models/association.js";

import { generateOtp,hashOtp} from "../utils/otp.utils.js";

import {  sendOtpEmail} from "../utils/mailer.js";

export const createAndSendOtp = async (userId, email, { useDevelopmentOtp = false } = {}) => {

    const shouldUseDevelopmentOtp =
        process.env.NODE_ENV === "development" && useDevelopmentOtp;
    const developmentOtp = shouldUseDevelopmentOtp
        ? process.env.DEV_OTP
        : null;

    if (shouldUseDevelopmentOtp && !/^\d{6}$/.test(developmentOtp || "")) {
        const error = new Error("DEV_OTP must be exactly 6 digits.");
        error.statusCode = 500;
        throw error;
    }

    // Use a fixed OTP only in development; production always gets a random OTP.
    const otp = developmentOtp || generateOtp();

    // Hash OTP
    const otpHash = hashOtp(otp);

    // 4 seconds expiry
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);


   // Remove previous OTPs
   await OtpVerification.destroy({ where: { userId }});

    // Save new OTP
    await OtpVerification.create({userId,otpHash,expiresAt});

    if (!developmentOtp) {
        await sendOtpEmail(email, otp);
    }

    return {
        otpDelivery: developmentOtp ? "development" : "email"
    };

};

export const verifyOtpService = async (email, otp) => {

    const user = await User.findOne({where: { email }});

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }


    const otpRecord = await OtpVerification.findOne({
        where: {  userId: user.id },

        order: [   ["createdAt", "DESC"] ]
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


    if (otpHash !== otpRecord.otpHash) {

    otpRecord.attempts += 1;
    await otpRecord.save();

    if (otpRecord.attempts >= 5) {
        await otpRecord.destroy();

        const error = new Error(  "Too many incorrect OTP attempts." );
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
