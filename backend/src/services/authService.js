import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/userRepository.js";

export default {
    signup: async (name, email, password) => {
        const existing = await userRepo.findByEmail(email);
        if (existing) throw new Error("Email already exists");

        const passwordHash = await bcrypt.hash(password, 10);
        return userRepo.create({ name, email, passwordHash, role: "customer" });
    },

    login: async (email, password) => {
        const user = await userRepo.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { token, user };
    }
};
