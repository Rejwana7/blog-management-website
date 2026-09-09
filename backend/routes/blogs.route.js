import { Router } from "express";

import { create, getBlogs, getBlog, update, remove} from "../controller/blog.controller.js";

import authMiddleWare from "../middleware/auth.middleware.js";

const router = Router();

// Public APIs
router.get("/blogs", getBlogs);

router.get("/blogs/:id", getBlog);
// Protected APIs
router.post("/blogs/create", authMiddleWare, create);

router.put( "/blogs/update/:id", authMiddleWare, update)


router.delete( "/blogs/:id", authMiddleWare, remove);

export default router;
