import express from "express";
import reservationFoodOrderController from "../controllers/reservationFoodOrderController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer: order food for a reservation
// POST /api/reservation-food-orders/:reservationId
router.post("/:reservationId", auth, reservationFoodOrderController.orderFoodForReservation);

// Customer: view food order for a reservation
// GET /api/reservation-food-orders/:reservationId
router.get("/:reservationId", auth, reservationFoodOrderController.getOrderForReservation);

export default router;
