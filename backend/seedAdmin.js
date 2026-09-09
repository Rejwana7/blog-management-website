import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import sequelize from "./config/db.js";
import User from "./models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();

        const existingAdmin = await User.findOne({
            where: {
                email: process.env.ADMIN_EMAIL
            }
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        const admin = await User.create({
            firstname: process.env.ADMIN_FIRSTNAME,
            lastname: process.env.ADMIN_LASTNAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            isActive: true
        });

        console.log("Admin created:", admin.email);

    } catch (error) {
        console.error("Seed admin error:", error);
    } finally {
        await sequelize.close();
    }
};

seedAdmin();