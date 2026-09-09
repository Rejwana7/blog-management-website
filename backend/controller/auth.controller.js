import { registerUser, loginUser,forgotPassword, resetPassword,verifyLoginOtp } from "../services/auth.service.js";

import { isEmpty,validateEmail,validatePassword} from "../utils/auth.validators.js";

export const register = async (req, res) => {
    console.log("REGISTER ROUTE HIT");

    try {

        const { firstname,lastname, email, password} = req.body;


        // firstname
        if (isEmpty(firstname)|| isEmpty(email)|| isEmpty(password)) {

            return res.status(400).json({
                message: "Firstname,email and password is required."
            });

        }

        if (!validateEmail(email)) {

            return res.status(400).json({
                message: "Invalid email format."
            });

        }

       if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be between 4 and 8 characters long."
            });
      }
      const user = await registerUser({ firstname, lastname, email, password});

        return res.status(201).json({

         message: "User registered successfully.",

         data: user
      });
    } catch (error) {

        return res.status(  error.statusCode || 500).json({
            message:  error.message || "Internal server error."
             });

   }
};


// export const login = async (req, res) => {

//     try {

//         const { email, password} = req.body;
//      // email required
//         if (isEmpty(email)) {

//             return res.status(400).json({
//                 message: "Email is required."
//             });

//         }
//       // password required
//         if (isEmpty(password)) {

//             return res.status(400).json({

//                     message: "Password is required."
//             });

//         }

//        // email format
//         if (!validateEmail(email)) {

//             return res.status(400).json({
//                 message: "Invalid email format."
//             });

//         }
//  const result = await loginUser(email, password );
//     return res.status(200).json({
//         message: "Login successful.",
//         data: result
//      });
//    } catch (error) {

//         return res.status(error.statusCode || 500  ).json({
//         message:
//          error.message || "Internal server error."
//           });

//     }
// };


export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Email required
        if (isEmpty(email)) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        // Password required
        if (isEmpty(password)) {
            return res.status(400).json({
                message: "Password is required."
            });
        }

        // Email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format."
            });
        }

        const result = await loginUser(  email, password );

        return res.status(200).json({
            message: "OTP sent to your email.",
            data: result
        });

    } catch (error) {

        return res.status( error.statusCode || 500 ).json({
            message:
                error.message || "Internal server error."
        });
    }
};

export const verifyOtp = async (req, res) => {

    try {

        const {  email, otp} = req.body;

        // Email required
        if (isEmpty(email)) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        // OTP required
        if (isEmpty(otp)) {
            return res.status(400).json({
                message: "OTP is required."
            });
        }

        // OTP must be 6 digits
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                message: "OTP must be 6 digits."
            });
        }

        const result = await verifyLoginOtp( email, otp); 

        return res.status(200).json({
            message: "Login successful.",
            data: result
        });

    } catch (error) {

        return res.status(  error.statusCode || 500 ).json({
            message:
                error.message || "Internal server error."
        });
    }
};

export const forgotPasswordController = async (req, res) => {

    try {

        const { email } = req.body;

        if (isEmpty(email)) {
            return res.status(400).json({message: "Email is required."});
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const result = await forgotPassword(email);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};



export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (isEmpty(token)) {
            return res.status(400).json({
                message: "Reset token is required."
            });
        }

        if (isEmpty(newPassword)) {
            return res.status(400).json({
                message: "New password is required."
            });
        }

        if (isEmpty(confirmPassword)) {
            return res.status(400).json({
                message: "Confirm password is required."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match."
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Invalid password."
            });
        }

        const result = await resetPassword( token, newPassword );

        return res.status(200).json(result);

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};