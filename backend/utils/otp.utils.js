import crypto from "crypto";

// Generate 4 digit OTP
export const generateOtp = () => {
    return crypto.randomInt(1000, 10000).toString();
};

// Hash OTP before saving into database
export const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};