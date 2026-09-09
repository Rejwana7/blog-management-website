// one place that wires the associations, so importing a single model can never
// leave the relation half-registered
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Blog from "./blog.model.js";
import PasswordResetToken from "./PasswordResetToken.model.js";
import OtpVerification from "./otp.model.js";
// blogs.userId references users.id
User.hasMany(Blog,
     {
     foreignKey: "userId", 
    as: "blogs",
     onDelete: "CASCADE"

      });
Blog.belongsTo(User, 
    { foreignKey: "userId", 
    as: "author" });

User.hasMany(PasswordResetToken, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

PasswordResetToken.belongsTo(User, {
    foreignKey: "userId"
});    
User.hasMany(OtpVerification, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

OtpVerification.belongsTo(User, {
    foreignKey: "userId"
});
export { sequelize, User, Blog ,  PasswordResetToken, OtpVerification};