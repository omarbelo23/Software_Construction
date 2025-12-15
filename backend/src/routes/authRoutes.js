// src/routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", authController.signup);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/users - Admin only
router.get("/users", auth, requireRole("admin"), authController.getAllUsers);

// DELETE /api/auth/users/:id - Admin only
router.delete("/users/:id", auth, requireRole("admin"), authController.deleteUser);

export default router;
