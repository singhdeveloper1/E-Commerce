import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"],
  },

  phone: {
    type: Number,
  },

  otp: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: () => Date.now(),
    expires: 300,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
