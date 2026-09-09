import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OtpVerification = sequelize.define(
    "OtpVerification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        otpHash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        tableName: "otp_verifications",
        timestamps: true
    }
);

export default OtpVerification;