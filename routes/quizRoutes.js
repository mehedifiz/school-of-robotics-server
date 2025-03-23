import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createQuiz, submitQuiz, updateQuiz, deleteQuiz, getQuizByChapter } from '../controllers/quizController.js';

const quizRouter = express.Router();

// Admin only routes
quizRouter.get('/get-quiz-by-chapter/:chapterId', auth('admin'), getQuizByChapter);
quizRouter.post('/create-quiz', auth('admin'), createQuiz);
quizRouter.put('/update-quiz/:quizId', auth('admin'), updateQuiz);
quizRouter.delete('/delete-quiz/:quizId', auth('admin'), deleteQuiz);

// User routes
quizRouter.post('/submit-quiz', auth('admin'), submitQuiz);

export default quizRouter;