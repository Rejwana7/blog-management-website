import { col, fn, Op, where as sequelizeWhere } from "sequelize";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

// Create Blog
export const createBlog = async ({userId,blogTitle, blog, category}) => {

    const newBlog = await Blog.create({ userId, blogTitle, blog, category});

    return newBlog;
};



// Get All Blogs
export const getAllBlogs = async ({ title, category }) => {

    const where = {};

    // Search by title
    if (title) {
        where.blogTitle = {
            [Op.like]: `%${title}%`
        };
    }

    // Filter by category
    if (category) {
        where[Op.and] = sequelizeWhere(
            fn("LOWER", col("Blog.category")),
            category.trim().toLocaleLowerCase()
        );
    }
     const blogs = await Blog.findAll({ where,attributes: [
            "id",
            "blogTitle",
            "blog",
            "category",
            "userId",
            "createAt",
            "updateAt"
        ],

        include: [
            {
                model: User,
                as: "author",
                attributes: [ "id","firstname", "lastname"   ]
            }
        ],

      order: [["id", "DESC"]]
    });

    return blogs;
};
//Get Blog by ID
export const getBlogById = async (id) => {

    const blog = await Blog.findByPk(id, {

        attributes: [
            "id",
            "blogTitle",
            "blog",
            "category",
            "userId",
            "createAt",
            "updateAt"
        ],

        include: [
            {
                model: User,
                as: "author",
                attributes: [
                    "id",
                    "firstname",
                    "lastname"
                ]
            }

         ]
    });

    if (!blog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    return blog;
}; 



// Update Blog
export const updateBlog = async ({ blogId, userId, role, blogTitle, blog, category}) => {

    const existingBlog = await Blog.findByPk(blogId);

    if (!existingBlog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    // Normal user can update only own blog
    if (role !== "admin" && existingBlog.userId !== userId) {
        const error = new Error( "You are not allowed to update this blog.");
        error.statusCode = 403;
        throw error;
    }

    existingBlog.blogTitle = blogTitle;
    existingBlog.blog = blog;
    existingBlog.category = category;

    await existingBlog.save();

    return existingBlog;
};

// Delete Blog
export const deleteBlog = async ({ blogId, userId, role}) => {

    const existingBlog = await Blog.findByPk(blogId);

    if (!existingBlog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    // Normal user can delete only own blog
    if (role !== "admin" && existingBlog.userId !== userId) {
        const error = new Error( "You are not allowed to delete this blog.");
        error.statusCode = 403;
        throw error;
    }

    await existingBlog.destroy();

     return {
        id: existingBlog.id
    };
};
