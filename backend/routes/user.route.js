import { Router } from "express";
import { getUsers, getUser, updateStatus} from "../controller/user.controller.js";
import {getProfile,updateProfile, updateUserPassword, updateProfileImageController} from "../controller/user.controller.js";

import authMiddleWare, { is_admin} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";
import  {uploadErrorHandler} from "../middleware/upload.middleware.js";
const router = Router()

// Admin only
router.get("/users",authMiddleWare, is_admin, getUsers);


// Admin only
router.get( "/users/:id",authMiddleWare, is_admin, getUser);


// Admin only
router.patch("/users/:id/status",authMiddleWare, is_admin, updateStatus);

// GET /api/users/profile
router.get( "/profile", authMiddleWare, getProfile);
// PUT /api/users/profile/update
router.put( "/profile/update", authMiddleWare, updateProfile)

// PATCH /api/users/password
router.patch( "/password", authMiddleWare, updateUserPassword);


router.patch("/profile/image", authMiddleWare,upload.single("image"),  uploadErrorHandler,
    updateProfileImageController);
// router.patch(
//   "/users/profile/image",
//   (req, res) => {
//     res.json({
//       success: true,
//       message: "Profile image route reached"
//     });
//   }
// );

export default router;