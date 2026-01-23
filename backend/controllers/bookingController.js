import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { sendBookingConfirmation } from "../utils/emailService.js";

// Create Booking (Mock Payment - Development Mode)
export const createBooking = async (req, res) => {
  try {
    const { 
      tripId, 
      travelers, 
      startDate, 
      endDate,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      paymentMethod = "mock"
    } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalAmount = trip.price * travelers;

    const booking = await Booking.create({
      user: req.user.id,
      trip: tripId,
      travelers,
      startDate,
      endDate,
      totalAmount,
      contactName: contactName || user.name,
      contactEmail: contactEmail || user.email,
      contactPhone,
      specialRequests,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: paymentMethod,
      paidAt: new Date(),
      stripePaymentIntentId: `mock_pi_${Date.now()}`
    });

    await booking.populate('trip');

    try {
      await sendBookingConfirmation(booking);
      booking.confirmationEmailSent = true;
      booking.confirmationEmailSentAt = new Date();
      await booking.save();
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
      mockPayment: {
        method: paymentMethod,
        amount: totalAmount,
        status: "paid",
        note: "Development mode - No real payment"
      }
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ 
      message: "Failed to create booking", 
      error: error.message 
    });
  }
};

// USER: Get My Bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('trip')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch bookings", 
      error: error.message 
    });
  }
};

// AGENCY: Get Bookings for My Trips
export const getAgencyBookings = async (req, res) => {
  try {
    // Find all trips created by this agency
    const myTrips = await Trip.find({ createdBy: req.user.id }).select('_id');
    const tripIds = myTrips.map(trip => trip._id);

    // Find all bookings for those trips
    const bookings = await Booking.find({ trip: { $in: tripIds } })
      .populate('trip')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch agency bookings", 
      error: error.message 
    });
  }
};

// ADMIN: Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('trip')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: bookings.length,
      bookings 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch bookings", 
      error: error.message 
    });
  }
};

// Get Single Booking (User, Agency who owns trip, or Admin)
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trip')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    const isOwner = booking.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Check if agency owns the trip
    const trip = await Trip.findById(booking.trip._id);
    const isAgencyOwner = req.user.role === 'agency' && 
                          trip.createdBy.toString() === req.user.id;

    if (!isOwner && !isAdmin && !isAgencyOwner) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch booking", 
      error: error.message 
    });
  }
};

// Get Calendar Bookings for a Trip
export const getTripCalendar = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify trip access
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check authorization for non-public access
    if (req.user.role === 'agency' && trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const query = { 
      trip: tripId,
      status: { $in: ['confirmed', 'pending'] }
    };

    if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { 
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ];
    }

    const bookings = await Booking.find(query)
      .select('startDate endDate travelers status contactName')
      .sort({ startDate: 1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch calendar", 
      error: error.message 
    });
  }
};

// AGENCY: Get All My Bookings Calendar
export const getAgencyCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Find all trips by this agency
    const myTrips = await Trip.find({ createdBy: req.user.id }).select('_id');
    const tripIds = myTrips.map(trip => trip._id);

    const query = { 
      trip: { $in: tripIds },
      status: { $in: ['confirmed', 'pending'] }
    };

    if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { 
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('trip', 'title destination')
      .select('startDate endDate travelers status contactName trip')
      .sort({ startDate: 1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch calendar", 
      error: error.message 
    });
  }
};

// ADMIN: Get All Bookings Calendar
export const getAdminCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { 
      status: { $in: ['confirmed', 'pending'] }
    };

    if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { 
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('trip', 'title destination')
      .populate('user', 'name email')
      .select('startDate endDate travelers status contactName trip user')
      .sort({ startDate: 1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch calendar", 
      error: error.message 
    });
  }
};

// Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Authorization check
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    await booking.save();

    res.json({ 
      success: true, 
      message: "Booking cancelled", 
      booking 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to cancel booking", 
      error: error.message 
    });
  }
};

// Update Booking Status (Agency/Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('trip');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if agency owns the trip
    const trip = await Trip.findById(booking.trip._id);
    const isAgencyOwner = req.user.role === 'agency' && 
                          trip.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAgencyOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ 
      success: true, 
      message: "Booking status updated", 
      booking 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to update booking", 
      error: error.message 
    });
  }
};