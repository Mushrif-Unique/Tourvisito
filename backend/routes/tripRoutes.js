// ========================================
// TRIP ROUTES
// backend/routes/tripRoutes.js
// ========================================
import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
  getMyTrips,
  updateTrip,
  deleteTrip,
  getMyTripStats,
  getAllTripStats,
  saveTrip,
  unsaveTrip,
  getSavedTrips,
  isTripSaved
} from "../controllers/tripController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getTrips);
router.get("/:id", getTrip);

// Traveler saved trips routes
router.post("/:tripId/save", protect, requireRole(['traveler']), saveTrip);
router.delete("/:tripId/save", protect, requireRole(['traveler']), unsaveTrip);
router.get("/traveler/saved", protect, requireRole(['traveler']), getSavedTrips);
router.get("/:tripId/saved-status", protect, requireRole(['traveler']), isTripSaved);

// Agency & Admin routes
router.post("/", protect, requireRole(['agency', 'admin']), createTrip);
router.get("/agency/my-trips", protect, requireRole(['agency', 'admin']), getMyTrips);
router.get("/agency/stats", protect, requireRole(['agency', 'admin']), getMyTripStats);
router.put("/:id", protect, requireRole(['agency', 'admin']), updateTrip);
router.delete("/:id", protect, requireRole(['agency', 'admin']), deleteTrip);

// Admin only routes
router.get("/admin/stats", protect, requireRole(['admin']), getAllTripStats);

export default router;