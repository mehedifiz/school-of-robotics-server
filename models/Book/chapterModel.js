const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: String,
  chapterNo: Number ,
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "book" },  
  pdfUrl: String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },  // Relation to Quiz
}, { timestamps: true });

 export const chapter = mongoose.model("chapter", chapterSchema);
