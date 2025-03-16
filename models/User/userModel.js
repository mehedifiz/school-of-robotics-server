import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
   
    unique: true,
    trim: true
  },
  phone: { 
    type: Number, 
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    enum: ["student", "admin"], 
    default: "student" 
  },
  subscription: { 
    type: String,
    enum: ["basic", "standard", "premium"],
    default: "basic"
  },
  progress: [
    {
      chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
      },
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);