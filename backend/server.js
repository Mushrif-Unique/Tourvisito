import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { apiLimiter } from "./config/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // matches your Vite frontend
  credentials: true,
}));

// APPLY LIMITER
// Note: If you have issues during development, you can comment this out
app.use("/api", apiLimiter);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/ai", aiRoutes);


// Error Handling (Must be last)
app.use(errorHandler);

// FIX: Added a fallback port. If process.env.PORT is undefined, 
// app.listen will fail without the "|| 5000"
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);