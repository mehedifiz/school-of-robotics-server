import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: { type: Number, unique: true }, // Added phone field
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  subscription: {
    plan: { type: String, enum: ["basic", "standard", "premium"], default: "basic" },
    expiresAt: Date,
  },
  progress: [
    {
      chapterId: mongoose.Schema.Types.ObjectId,
      moduleId: mongoose.Schema.Types.ObjectId,
      completed: Boolean,  
    }
  ],
}, { timestamps: true });
 
export const User = mongoose.model("User", userSchema);