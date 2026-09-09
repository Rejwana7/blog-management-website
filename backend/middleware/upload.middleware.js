import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profile");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${file.originalname}`;

        cb(null, uniqueName);
    }
});






const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
         "image/jpg",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only JPG, JPEG, PNG and WEBP images are allowed."),
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