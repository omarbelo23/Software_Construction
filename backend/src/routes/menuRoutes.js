// src/routes/menuRoutes.js
import express from "express";
import menuController from "../controllers/menuController.js";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public: view menu
// GET /api/menu
router.get("/", menuController.list);

// Admin: add a new menu item
// POST /api/menu
router.post("/", auth, requireRole("admin"), menuController.create);

export default router;
