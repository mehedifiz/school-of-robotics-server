const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  
  plan: { type: String, enum: ["basic", "standard", "premium"] },  // Plan-based access
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }]  // Relation with Modules
}, { timestamps: true });

export const course = mongoose.model("course", courseSchema);
