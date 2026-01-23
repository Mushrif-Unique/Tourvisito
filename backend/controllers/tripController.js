import Trip from "../models/Trip.js";

// Create Trip (Agency & Admin)
export const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ 
      ...req.body, 
      createdBy: req.user.id 
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Trip created successfully",
      trip 
    });
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ 
      message: "Failed to create trip", 
      error: error.message 
    });
  }
};

// Get All Trips (Public)
export const getTrips = async (req, res) => {
  try {
    const { 
      destination, 
      minPrice, 
      maxPrice, 
      duration, 
      category 
    } = req.query;

    let query = {};

    // Filter by destination
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by duration
    if (duration) {
      query.duration = Number(duration);
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const trips = await Trip.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: trips.length,
      trips 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch trips", 
      error: error.message 
    });
  }
};

// Get Single Trip
export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('createdBy', 'name email role');

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch trip", 
      error: error.message 
    });
  }
};

// AGENCY: Get My Trips (Only trips created by logged-in agency)
export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: trips.length,
      trips 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch your trips", 
      error: error.message 
    });
  }
};

// Update Trip (Agency can update own trips, Admin can update any)
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check authorization
    if (req.user.role !== 'admin' && trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "Not authorized to update this trip" 
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ 
      success: true, 
      message: "Trip updated successfully",
      trip: updatedTrip 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to update trip", 
      error: error.message 
    });
  }
};

// Delete Trip (Agency can delete own trips, Admin can delete any)
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check authorization
    if (req.user.role !== 'admin' && trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "Not authorized to delete this trip" 
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: "Trip deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to delete trip", 
      error: error.message 
    });
  }
};

// AGENCY: Get Statistics for My Trips
export const getMyTripStats = async (req, res) => {
  try {
    const trips = await Trip.find({ createdBy: req.user.id });
    
    const stats = {
      totalTrips: trips.length,
      activeTrips: trips.filter(t => t.status === 'active').length,
      totalRevenue: trips.reduce((sum, trip) => sum + (trip.price * trip.bookings || 0), 0),
      averagePrice: trips.length > 0 
        ? trips.reduce((sum, trip) => sum + trip.price, 0) / trips.length 
        : 0
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch statistics", 
      error: error.message 
    });
  }
};

// ADMIN: Get All Trip Statistics
export const getAllTripStats = async (req, res) => {
  try {
    const trips = await Trip.find();
    
    const stats = {
      totalTrips: trips.length,
      totalAgencies: await Trip.distinct('createdBy').length,
      activeTrips: trips.filter(t => t.status === 'active').length,
      totalRevenue: trips.reduce((sum, trip) => sum + (trip.price * trip.bookings || 0), 0),
      averagePrice: trips.length > 0 
        ? trips.reduce((sum, trip) => sum + trip.price, 0) / trips.length 
        : 0,
      tripsByCategory: trips.reduce((acc, trip) => {
        acc[trip.category] = (acc[trip.category] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch statistics", 
      error: error.message 
    });
  }
};