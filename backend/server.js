import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import reservationRoutes from "./src/routes/reservationRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
