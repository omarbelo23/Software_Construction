import express from "express";
import controller from "../controllers/feedbackController.js";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, controller.submit);
router.get("/all", auth, requireRole("admin"), controller.list);

export default router;
