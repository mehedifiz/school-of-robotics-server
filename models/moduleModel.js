const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },  
  videoLinks: [{
    title: String ,
    link: String
  }],   
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },   
}, { timestamps: true });

export const module = mongoose.model("module", moduleSchema);
