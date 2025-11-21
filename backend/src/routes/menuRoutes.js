import express from "express";
import controller from "../controllers/menuController.js";

const router = express.Router();

router.get("/", controller.list);

export default router;
