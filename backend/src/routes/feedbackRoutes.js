// src/routes/feedbackRoutes.js
import express from "express";
import feedbackController from "../controllers/feedbackController.js";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Customer: submit feedback
// POST /api/feedback
router.post("/", auth, feedbackController.submit);

// Admin: view all feedback
// GET /api/feedback
router.get("/", auth, requireRole("admin"), feedbackController.list);

export default router;
