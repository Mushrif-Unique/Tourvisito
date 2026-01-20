import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  method: String,
  status: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
