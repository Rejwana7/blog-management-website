import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blogs.route.js";
import path from "path";
const app=express();
app.use(helmet());
app.use(cors());
app.use(express.json())
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Blog Management REST API is running."
    });
});
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/auth",authRoute)
app.use("/api", userRoute);
app.use("/api", blogRoute);
export default app;