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

app.use(express.json());
app.use(cors());
app.use("/api", apiLimiter);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
