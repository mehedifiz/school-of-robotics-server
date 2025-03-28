import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  validationId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  paymentDetails: {
    cardType: String,
    bankTransId: String,
    cardIssuer: String,
    cardBrand: String
  }
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);