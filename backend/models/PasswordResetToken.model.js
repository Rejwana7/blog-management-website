import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PasswordResetToken = sequelize.define(
    "PasswordResetToken",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },

        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
           field: 'token_hash'
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

      usedAt: {
        type: DataTypes.DATE,
       allowNull: true,
       defaultValue: null
   }
    },
    {
        tableName: "password_reset_tokens",
        timestamps: true,
        createdAt: "createAt",
        updatedAt: "updateAt"
    }
);

export default PasswordResetToken;