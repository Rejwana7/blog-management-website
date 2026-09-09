import crypto from "crypto";

// Generate 6 digit OTP
export const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// Hash OTP before saving into database
export const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};