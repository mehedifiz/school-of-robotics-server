import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: String,
  chapterNo: Number ,
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },  
  pdfUrl: String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },  // Relation to Quiz
}, { timestamps: true });

 export const Chapter = mongoose.model("Chapter", chapterSchema);
