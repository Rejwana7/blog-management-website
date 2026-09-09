import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export const sendResetEmail = async (to, resetLink) => {
    await transporter.sendMail({
        from: process.env.GMAIL,
        to: to,
        subject: "Reset Your Password",

        html: `
            <h2>Password Reset</h2>

            <p>You requested to reset your password.</p>

            <p>Click the button below to reset your password:</p>

            <a href="${resetLink}"
               style="
                 display:inline-block;
                 padding:10px 20px;
                 background:#007bff;
                 color:white;
                 text-decoration:none;
                 border-radius:5px;
               ">
                Reset Password
            </a>

            <p>This link will expire in 20 minutes.</p>

            <p>If you did not request this, you can ignore this email.</p>
        `
    });
};


// Login OTP email
export const sendOtpEmail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.GMAIL,
        to: to,
        subject: "Your Login OTP",
        html: `
            <h2>Login Verification</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP will expire in 3 seconds.</p>

            <p>If you did not request this OTP, please ignore this email.</p>
        `
       });
};     