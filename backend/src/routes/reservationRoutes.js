// src/routes/reservationRoutes.js
import express from "express";
import reservationController from "../controllers/reservationController.js";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Customer: create reservation
// POST /api/reservations
router.post("/", auth, reservationController.create);

// Customer: list their own reservations
// GET /api/reservations/my
router.get("/my", auth, reservationController.listUser);

// Customer: delete their own reservation
// DELETE /api/reservations/:id
router.delete("/:id", auth, reservationController.delete);

// Admin: list ALL reservations
// GET /api/reservations
router.get("/", auth, requireRole("admin"), reservationController.listAll);

export default router;
