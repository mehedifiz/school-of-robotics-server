import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Basic Plan", "Standard Plan", "Premium Plan", "Free Plan"],
    immutable: true
  },
  
    price: {
      type: Number,
      required: true,
      min: 0
    },
  duration: {
    type: Number,
    require: true
  },
  features: [{
    type: String,
    required: true
  }],
  resourceAccess: {
    courses: {
      type: String,
      enum: ["basic", "standard", "premium", "free"],
      required: true
    },
    books: {
      type: String,
      enum: ["basic", "standard", "premium", "free"],
      required: true
    }
  },
  description: {
    type: String,
    required: true,
    maxLength: 500
  }
}, { timestamps: true });

export const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);