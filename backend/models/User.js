import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  role: {
    type: String,
    enum: ["traveler", "agency", "admin"], // ✅ only these roles allowed
    default: "traveler" // ✅ default traveler
  },

  // Agency-specific fields
  agencyName: {
    type: String,
    required: function () { return this.role === "agency"; }
  },
  agencyLicense: String,
  agencyDescription: String,
  agencyPhone: String,
  agencyAddress: String,

  // User profile fields
  phone: String,
  profilePicture: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for faster queries
userSchema.index({ email: 1, role: 1 });

export default mongoose.model("User", userSchema);
