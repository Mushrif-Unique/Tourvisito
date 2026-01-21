import express from "express";
import { generateItinerary } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

console.log("🚀 [DEBUG]: aiRoutes.js file is being loaded by the server...");

const router = express.Router();

// 1. Proof of Life - Test this in browser: http://localhost:5000/api/v1/ai/test
router.get("/test", (req, res) => {
  console.log("GET /api/v1/ai/test was hit!");
  res.send("AI Route is working!");
});

// 2. The Main AI Route
router.post("/ai-generate", (req, res, next) => {
  console.log("POST /api/v1/ai/ai-generate was hit!");
  console.log("Request Body:", req.body);
  next();
}, generateItinerary);

export default router;