import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createQuiz, submitQuiz } from '../controllers/quizController.js';

const quizRouter = express.Router();

// Admin only routes
quizRouter.post('/create-quiz',   createQuiz);

quizRouter.post('/submit-quiz', auth('student'), submitQuiz);

export default quizRouter;