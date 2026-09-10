import { getAllUsers,getUserById,updateUserStatus} from "../services/user.service.js";
import {getOwnProfile,updateOwnProfile,updatePassword,updateProfileImage} from "../services/user.service.js";
import { isEmpty, validatePassword, validateEmail, validateName } from "../utils/auth.validators.js";

// GET /api/users
export const getUsers = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                message: "Page and limit must be greater than 0."
            });
        }

        const result = await getAllUsers(page, limit);

        return res.status(200).json({
            message: "Users retrieved successfully.",
            data: result
        });

    } catch (error) {

         return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};

// GET /api/users/:id
export const getUser = async (req, res) => {

    try {

        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        const user = await getUserById(id);

        return res.status(200).json({
            message: "User retrieved successfully.",
            data: user
        });
         } 
         catch (error) {

        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};

// PATCH /api/users/:id/status
export const updateStatus = async (req, res) => {

    try {

        const { id } = req.params;
        // isActive অথবা isactive
        const isActive = req.body?.isActive ?? req.body?.isactive;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be true or false."
            });
        }

        if (!isActive && Number(id) === Number(req.user.id)) {
            return res.status(400).json({
                message: "You cannot deactivate your own account."
            });
        }

          
        const user = await updateUserStatus(id, isActive);

        return res.status(200).json({
            message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
            data: user
        });

    } 
    catch (error) {

        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};





// Get Own Profile
export const getProfile = async (req, res) => {

    try {

        const user = await getOwnProfile(req.user.id);

        return res.status(200).json({
            message: "Profile retrieved successfully.",
            data: user
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};


// Update Own Profile
export const updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, email,role, isActive } = req.body;
        if (role !== undefined || isActive !== undefined) {
    return res.status(403).json({
        message: "You are not allowed to update role or isActive."
    });
  }

        if (isEmpty(firstname) || isEmpty(email)) {
            return res.status(400).json({
                message: "Firstname and email is required."
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format."
            });
        }

        if (!validateName(firstname) || (!isEmpty(lastname) && !validateName(lastname))) {
            return res.status(400).json({
                message: "First name and last name can contain letters and spaces only."
            });
        }

        const user = await updateOwnProfile(req.user.id, firstname.trim(), lastname?.trim() || null, email.trim());

        return res.status(200).json({
            message: "Profile updated successfully.",
            data: user
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};

// Update Password
export const updateUserPassword = async (req, res) => {

    try {

        const { password } = req.body;

        if (isEmpty(password)) {
            return res.status(400).json({
                message: "Password is required."
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must be between 4 and 8 characters."
            });
        }

        const result = await updatePassword( req.user.id, password);

        return res.status(200).json({
            message: "Password updated successfully.",
            data: result
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }


};




export const updateProfileImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required."
            });
        }

        const imagePath = `/uploads/profile/${req.file.filename}`;

        const result = await updateProfileImage( req.user.id, imagePath );

        return res.status(200).json({
            message: "Profile image updated successfully.",
            data: result
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};
