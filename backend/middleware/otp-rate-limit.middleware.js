import { rateLimit } from "express-rate-limit";

const createOtpRateLimiter = ({ windowMs, limit, message }) => rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ message });
    }
});

export const otpRequestRateLimiter = createOtpRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many OTP requests. Please try again after 15 minutes."
});

export const otpVerificationRateLimiter = createOtpRateLimiter({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    message: "Too many OTP verification attempts. Please try again after 10 minutes."
});
