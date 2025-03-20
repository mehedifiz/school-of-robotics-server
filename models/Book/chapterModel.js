import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  chapterNo: {
    type: Number,
    required: true
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Book",
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  }
}, { timestamps: true });

export const Chapter = mongoose.model("Chapter", chapterSchema);