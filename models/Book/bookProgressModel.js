import mongoose from "mongoose";

const bookProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "book" },
    completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "chapter" }],
  },
  { timestamps: true }
);

export const Progress = mongoose.model("BookProgress", bookProgressSchema);
