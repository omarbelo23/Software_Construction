import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/User.js";

const MONGO_URI = "mongodb://localhost:27017/restaurant_db";

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "admin@example.com";
        const password = "admin123";
        const name = "Admin";

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log(`User ${email} already exists. Updating to admin.`);
            user.role = "admin";
            user.passwordHash = await bcrypt.hash(password, 10);
            await user.save();
        } else {
            console.log(`Creating new admin user: ${email}`);
            const passwordHash = await bcrypt.hash(password, 10);
            user = await User.create({
                name,
                email,
                passwordHash,
                role: "admin"
            });
        }
        console.log(`Admin user ready: ${email} / ${password}`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
