import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  status: { type: String, default: "Pending" },
  paymentStatus: { type: String, default: "Unpaid" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
