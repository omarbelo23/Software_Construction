// src/services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/userRepository.js";

function toSafeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export default {
    // Signup: create a new user (default role = "customer")
    signup: async (name, email, password, adminCode) => {
        const existing = await userRepo.findByEmail(email);
        if (existing) throw new Error("Email already exists");

        const passwordHash = await bcrypt.hash(password, 10);

        // Check if admin code is provided and correct
        const ADMIN_SECRET_CODE = process.env.ADMIN_CODE || "ADMIN2024";
        const role = (adminCode && adminCode === ADMIN_SECRET_CODE) ? "admin" : "customer";

        const user = await userRepo.create({
            name,
            email,
            passwordHash,
            role: role,
        });

        // Return user without passwordHash
        return toSafeUser(user);
    },

    // Login: return JWT + safe user data
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

        return {
            token,
            user: toSafeUser(user),
        };
    },

    // Admin: Get all users
    getAllUsers: async () => {
        return await userRepo.findAll();
    },

    // Admin: Delete a user
    deleteUser: async (userId) => {
        const user = await userRepo.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return await userRepo.deleteById(userId);
    },
};
