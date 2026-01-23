import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  trip: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Trip",
    required: true 
  },
  
  // Booking Details
  travelers: {
    type: Number,
    default: 1,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Payment Information
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: { 
    type: String, 
    enum: ["unpaid", "pending", "paid", "refunded"],
    default: "unpaid" 
  },
  paymentMethod: {
    type: String,
    enum: ["mock", "stripe", "paypal", "cash", "bank_transfer"], // ✅ Added "mock" and "bank_transfer"
    default: "mock" // ✅ Changed default to "mock" for development
  },
  stripePaymentIntentId: String,
  stripeSessionId: String,
  paypalOrderId: String,
  paidAt: Date,
  
  // Booking Status
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending" 
  },
  
  // Contact Information
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  specialRequests: String,
  
  // Email Notifications
  confirmationEmailSent: {
    type: Boolean,
    default: false
  },
  confirmationEmailSentAt: Date,
  
  // Cancellation
  cancelledAt: Date,
  cancellationReason: String,
  refundAmount: Number,
  
}, { timestamps: true });

// Index for calendar queries
bookingSchema.index({ startDate: 1, endDate: 1 });
bookingSchema.index({ trip: 1, startDate: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);