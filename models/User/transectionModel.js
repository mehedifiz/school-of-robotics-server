import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // Some models use lowercase refs
      ref: "user",
      required: true,
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Others use PascalCase refs
export const Transaction = mongoose.model("Transaction", transactionSchema);
