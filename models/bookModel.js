const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: String,
  plan: { type: String, enum: ["basic", "standard", "premium"] },  
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "chapter" }]  
}, { timestamps: true });

export const book = mongoose.model("book", bookSchema);
