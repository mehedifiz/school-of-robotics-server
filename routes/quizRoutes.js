import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createQuiz } from '../controllers/quizController.js';

const quizRouter = express.Router();

// Admin only routes
quizRouter.post('/create-quiz',   createQuiz);

export default quizRouter;