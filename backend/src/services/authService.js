import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/userRepository.js";
import { JWT_SECRET } from "../config/jwt.js";

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export default {
  signup: async (name, email, password, adminCode) => {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    if (!password) throw new Error("Password is required");

    const passwordHash = await bcrypt.hash(password, 10);

    const ADMIN_SECRET_CODE = process.env.ADMIN_CODE || "ADMIN2024";
    const role =
      adminCode && adminCode === ADMIN_SECRET_CODE ? "admin" : "customer";

    const user = await userRepo.create({
      name,
      email,
      passwordHash,
      role,
    });

    return toSafeUser(user);
  },

  login: async (email, password) => {
    if (!email || !password) throw new Error("Email and password are required");

    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: toSafeUser(user),
    };
  },

  getAllUsers: async () => {
    return await userRepo.findAll();
  },

  deleteUser: async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    return await userRepo.deleteById(userId);
  },
};
