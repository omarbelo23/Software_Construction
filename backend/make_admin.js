import mongoose from "mongoose";
import User from "./src/models/User.js";

const MONGO_URI = "mongodb://localhost:27017/restaurant_db"; // Assuming this is the URI based on previous context or defaults

async function makeAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const user = await User.findOne({ email: "test@admin.com" });
        if (user) {
            user.role = "admin";
            await user.save();
            console.log("User test@admin.com updated to admin.");
        } else {
            console.log("User test@admin.com not found.");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

makeAdmin();
