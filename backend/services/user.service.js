import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 10) => {

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({attributes:{ exclude: ["password"] },
        limit,
        offset,
        order: [["id", "ASC"]]
    });

    return {
        users: rows,
        pagination: {
            totalUsers: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit
          }
    };
};
     

// Get user by ID
export const getUserById = async (id) => {

    const user = await User.findByPk(id,{ attributes: { exclude: ["password"]} });

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

// Activate / Deactivate user
export const updateUserStatus = async (id, isActive) => {

    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    user.isActive = isActive;

    await user.save();

    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isActive: user.isActive,
        role: user.role

       };
}; 


// Get own profile
export const getOwnProfile = async (userId) => {

    const user = await User.findByPk(userId, { attributes: {exclude: ["password"] } });

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    return user;
};


// Update own profile
export const updateOwnProfile = async ( userId, firstname, lastname,  email) => {

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    // Check email uniqueness
    if (email !== user.email) {

        const existingUser = await User.findOne({where: { email } });

        if (existingUser) {
            const error = new Error("Email already exists.");
            error.statusCode = 409;
            throw error;
        }

        user.email = email;
    }

    user.firstname = firstname;
    user.lastname = lastname;

    await user.save();

    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isActive: user.isActive,
        role: user.role
    };
};



//Update password
export const updatePassword = async (userId, password) => {

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return {
        id: user.id,
        email: user.email
    };
};

// export const updateProfileImage = async (userId, imagePath) => {
//     const user = await User.findByPk(userId);

//     if (!user) {
//         const error = new Error("User not found.");
//         error.statusCode = 404;
//         throw error;
//     }

//     user.profilePicture = imagePath;

//     await user.save();

//     return {
//         id: user.id,
//         profilePicture: user.profilePicture
//     };
// };





export const updateProfileImage = async (userId, imagePath) => {

    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    // old image path 
    const oldImagePath = user.profilePicture;

    // new image path database save 
    user.profilePicture = imagePath;
    await user.save();

    // after Database update image save
    if (oldImagePath) {

        const oldFilePath = path.join(
            process.cwd(),
            oldImagePath.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }
    }

    return {
        id: user.id,
        profilePicture: user.profilePicture
    };
};