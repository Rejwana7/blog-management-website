import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
       profilePicture: {
     type: DataTypes.STRING(500),
      allowNull: true,
  },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        role: {
            type: DataTypes.ENUM("admin", "user"),
            defaultValue: "user"
        }
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "createAt",
        updatedAt: "updateAt"
    }
);

export default User;