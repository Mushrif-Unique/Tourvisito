import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  title: String,
  destination: String,
  duration: Number,
  price: Number,
  itinerary: [String],
  mapLocation: {
    lat: Number,
    lng: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
