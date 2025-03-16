import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },  // Who attempted
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },  // Which quiz
  selectedOptions: [{
    text: String,
    isCorrect: Boolean,
    questionNo: Number , 
  }],  // Selected Answers
  score: Number,  // Total Score
  passed: Boolean,  // If passed or not
}, { timestamps: true });

export const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);
