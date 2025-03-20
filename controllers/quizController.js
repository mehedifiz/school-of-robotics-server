import { Quiz } from "../models/quiz/QuizModel.js";
import { Chapter } from "../models/Book/chapterModel.js";

export const createQuiz = async (req, res) => {
  try {
    const { chapterId, title, questions } = req.body;

    // Validate if chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    // Check if quiz already exists for this chapter
    const existingQuiz = await Quiz.findOne({ chapterId });
    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz already exists for this chapter"
      });
    }

    // Create new quiz
    const newQuiz = await Quiz.create({
      title,
      chapterId,
      questions: questions.map((q, index) => ({
        ...q,
        questionNo: index + 1
      }))
    });

    // Update chapter with quiz reference
    await Chapter.findByIdAndUpdate(chapterId, {
      quizId: newQuiz._id
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: newQuiz
    });

  } catch (error) {
    console.error("Create quiz error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create quiz"
    });
  }
};