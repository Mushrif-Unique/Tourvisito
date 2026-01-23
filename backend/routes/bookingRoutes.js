// ========================================
// BOOKING ROUTES
// backend/routes/bookingRoutes.js
// ========================================
import express from "express";
import {
  createBooking,
  getUserBookings,
  getAgencyBookings,
  getAllBookings,
  getBooking,
  getTripCalendar,
  getAgencyCalendar,
  getAdminCalendar,
  cancelBooking,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);
router.get("/:id", protect, getBooking);
router.put("/:id/cancel", protect, cancelBooking);

// Trip calendar (public with trip ID)
router.get("/calendar/trip/:tripId", getTripCalendar);

// Agency routes
router.get("/agency/all", protect, requireRole(['agency', 'admin']), getAgencyBookings);
router.get("/agency/calendar", protect, requireRole(['agency', 'admin']), getAgencyCalendar);
router.put("/:id/status", protect, requireRole(['agency', 'admin']), updateBookingStatus);

// Admin routes
router.get("/admin/all", protect, requireRole(['admin']), getAllBookings);
router.get("/admin/calendar", protect, requireRole(['admin']), getAdminCalendar);

export default router;