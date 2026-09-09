import app from "./app.js";

import sequelize from "./config/db.js";
import "./models/association.js";


import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT || 5001;
// await initDB();

try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("DB is connected");

    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    });

} catch (error) {
    console.error("Error is:", error);
}