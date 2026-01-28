import mongoose from "mongoose";

const savedTripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  }
}, { timestamps: true });

// Ensure a user can only save a trip once
savedTripSchema.index({ user: 1, trip: 1 }, { unique: true });

export default mongoose.model("SavedTrip", savedTripSchema);
