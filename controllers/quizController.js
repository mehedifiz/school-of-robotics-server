import { Quiz } from "../models/quiz/QuizModel.js";
import { Chapter } from "../models/Book/chapterModel.js";
import { QuizSubmission } from "../models/quiz/quizsubmissoin.js";

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

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, selectedOptions } = req.body;
    const userId = req.user?._id;

    console.log('Submitting quiz:', {
      userId: userId.toString(),
      quizId,
      selectedOptionsCount: selectedOptions.length
    });

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if already submitted
    const existingSubmission = await QuizSubmission.findOne({
      userId,
      quizId
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "Quiz already submitted"
      });
    }

    // Calculate score
    let score = 0;
    selectedOptions.forEach(answer => {
      const question = quiz.questions.find(q => q.questionNo === answer.questionNo);
      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption.text === answer.text) {
          score++;
        }
      }
    });

    // Calculate pass/fail (e.g., 60% passing mark)
    const totalQuestions = quiz.questions.length;
    const percentageScore = (score / totalQuestions) * 100;
    const passed = percentageScore >= 60;

    // Create submission
    const submission = await QuizSubmission.create({
      userId,
      quizId,
      selectedOptions,
      score,
      passed
    });

    console.log('Quiz submission created:', submission._id.toString());

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        submissionId: submission._id,
        score,
        totalQuestions,
        percentageScore,
        passed
      }
    });

  } catch (error) {
    console.error("Quiz submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message
    });
  }
};