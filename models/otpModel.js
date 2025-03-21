import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Document will be deleted after 300 seconds (5 minutes)
  }
});

export const OTP = mongoose.model("OTP", otpSchema);