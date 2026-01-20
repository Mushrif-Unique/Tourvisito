import express from "express";
import { generateItinerary } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", protect, generateItinerary);

export default router;
