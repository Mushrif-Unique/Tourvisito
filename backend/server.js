// backend/server.js (or index.js)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import middleware
import { errorHandler, notFound, handleMongooseError } from "./middleware/errorHandler.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// ========================================
// MIDDLEWARE
// ========================================

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ========================================
// ROUTES
// ========================================

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "TravelHub API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/ai", aiRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// Handle 404 routes
app.use(notFound);

// Handle Mongoose errors
app.use(handleMongooseError);

// General error handler (must be last)
app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 TravelHub API Server Running     ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                        
║   Environment: ${process.env.NODE_ENV || 'development'}
║   Database: ${process.env.MONGODB_URI ? '✅ Connected' : '⚠️  Check connection'}
╚════════════════════════════════════════╝
  `);
});