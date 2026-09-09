import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog} from "../services/blog.service.js";

import { isEmpty } from "../utils/auth.validators.js";


export const create = async (req, res) => {
    try {

        // const blogTitle = req.body.blogTitle?.trim();
        // const blog = req.body.blog?.trim();
        // const category = req.body.category?.trim();

         // Blog title
        const blogTitle = ( req.body.blogTitle ?? req.body.blogtitle ?? req.body.BlogTitle )?.trim();

        // Blog content
        const blog = ( req.body.blog ??  req.body.Blog)?.trim();

        // Category
        const category = ( req.body.category ?? req.body.Category)?.trim();

        if (isEmpty(blogTitle) || isEmpty(blog) ||isEmpty(category)) {
            return res.status(400).json({
                message:
                    "Blog title, blog content and category are required."
            });
        }

        const newBlog = await createBlog({ userId: req.user.id, blogTitle, blog,category });

        return res.status(201).json({
            message: "Blog created successfully.",
            data: newBlog
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error."
        });
    }
};


// GET /api/blogs
export const getBlogs = async (req, res) => {

    try {

        const { title,  category} = req.query;

        const blogs = await getAllBlogs({ title, category});

        return res.status(200).json({
            message: "Blogs retrieved successfully.",
            data: blogs
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message:
                error.message ||  "Internal server error."
        });
    }
};

// GET /api/blogs/:id
export const getBlog = async (req, res) => {

    try {

        const { id } = req.params;

        // Validate ID
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Invalid blog ID."
            });
        }

        const blog = await getBlogById(id);

        return res.status(200).json({
            message: "Blog retrieved successfully.",
            data: blog
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message:
                error.message ||
                "Internal server error."
        });
    }
};

// PUT /api/blogs/update/:id
export const update = async (req, res) => {

    try {

        const { id } = req.params;

        const blogTitle = req.body.blogTitle?.trim();
        const blog = req.body.blog?.trim();
        const category = req.body.category?.trim();

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({  message: "Invalid blog ID." });
        }

        if ( isEmpty(blogTitle) || isEmpty(blog) || isEmpty(category)) {
            return res.status(400).json({ message:"Blog title, blog content and category are required."
            });
        }

        const updatedBlog = await updateBlog({
            blogId: id,
            userId: req.user.id,
            role: req.user.role,
            blogTitle,
            blog,
            category
              });

        return res.status(200).json({
            message: "Blog updated successfully.",
            data: updatedBlog
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message:
                error.message ||
                "Internal server error."
        });
    }
};



// DELETE /api/blogs/:id
export const remove = async (req, res) => {

    try {

        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Invalid blog ID."
            });
        }

        const result = await deleteBlog({
            blogId: id,
            userId: req.user.id,
            role: req.user.role
        });

        return res.status(200).json({
            message: "Blog deleted successfully.",
               data: result
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message:
                error.message ||
                "Internal server error."
        });
    }
};