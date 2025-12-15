// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import reservationRoutes from "./src/routes/reservationRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import reservationFoodOrderRoutes from "./src/routes/reservationFoodOrderRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/reservation-food-orders", reservationFoodOrderRoutes);

// IMPORTANT: Do NOT use process.env.PORT at all for now.
// Hardcode to a safe port that we know is free.
const PORT = 4001;

console.log("Starting server on fixed port:", PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
