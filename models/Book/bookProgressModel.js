import mongoose from "mongoose";

const bookProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  },
  { timestamps: true }
);

export const BookProgress = mongoose.model("BookProgress", bookProgressSchema);
