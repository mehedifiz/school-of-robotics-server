const mongoose = require("mongoose");

// Course Progress Schema
const courseProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "course", 
    required: true 
  },
  moduleProgress: [{
    moduleId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "module" 
    },
    status: { 
      type: String, 
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started"
    },
    completedAt: Date,
    quizSubmissionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "quizSubmission" 
    },
    quizPassed: { 
      type: Boolean, 
      default: false 
    }
  }],
  overallProgress: {
    type: Number,
    default: 0
  }, // Percentage of course completed (0-100)
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure one progress record per user per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });