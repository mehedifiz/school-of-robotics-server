import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }, 
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

    }, 
  ],
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", quizSchema);
