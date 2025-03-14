const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "chapter" },  // For Book Chapters
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "module" },  // For Course Modules
  questions: [
    {
      question: String,
      questionNo: Number , 
      options: [{
        text: String,
        isCorrect: Boolean
      }]

    }
  ],
}, { timestamps: true });

export const quiz = mongoose.model("quiz", quizSchema);
