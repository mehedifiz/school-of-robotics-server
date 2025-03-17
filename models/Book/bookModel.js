import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: String,
  description:String,
  thumbnail:String,
  plan: { type: String, enum: ["basic", "standard", "premium"] },  
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }]  
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);
 