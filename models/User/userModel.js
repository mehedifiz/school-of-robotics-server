const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  subscription: {
    plan: { type: String, enum: ["basic", "standard", "premium"], default: "" },
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

 
export const user = mongoose.model("user", userSchema);

