import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["basic", "standard", "premium", "free"],
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
  }] ,
  description: {
    type: String,
    required: true,
    maxLength: 500
  }
}, { timestamps: true });

export const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);