import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import reservationFoodOrderRoutes from "./routes/reservationFoodOrderRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

export function createApp() {
  const app = express();

  // middleware
  app.use(cors());
  app.use(express.json());

  // health (for integration tests)
  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
  });

  // ✅ mount routes (adjust prefixes if your server.js uses different ones)
  app.use("/api/auth", authRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/reservations", reservationRoutes);
  app.use("/api/reservation-food-orders", reservationFoodOrderRoutes);
  app.use("/api/feedback", feedbackRoutes);

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error"
    });
  });

  return app;
}
