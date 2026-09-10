import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDirectory = path.join(process.cwd(), "uploads", "profile");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "-")}`;

        cb(null, uniqueName);
    }
});






const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
         "image/jpg",
        "image/webp",
        "image/avif"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only JPG, JPEG, PNG, WEBP and AVIF images are allowed."),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Image size must not exceed 5 MB."
            });
        }

        return res.status(400).json({
            message: err.message
        });
    }

    if (err) {
        return res.status(400).json({
            message: err.message
        });
    }

    next();
};

export default upload;
