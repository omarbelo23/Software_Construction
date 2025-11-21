import express from "express";
import controller from "../controllers/reservationController.js";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, controller.create);
router.get("/my", auth, controller.listUser);
router.get("/all", auth, requireRole("admin"), controller.listAll);

export default router;
