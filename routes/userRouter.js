import express from "express";
import auth from "../middleware/authMiddleware.js";
import { 
  getAllUser, 
  getUserByID, 
  updateProfile,
  getUserStats,
  getQuizStats,
  getWeeklyPerformance 
} from "../controllers/userController.js";
import { getBookProgress, getUserReadingProgress, updateLastReadChapter, markChapterComplete } from "../controllers/bookController.js";
 

const userRouter = express.Router();

// get single user 
userRouter.get("/get-user/:id"   , getUserByID)

// get all user 

userRouter.get("/get-all" , getAllUser)

userRouter.get('/book-progress/:bookId', auth('student', 'admin'), getBookProgress);

// Get all reading progress
userRouter.get('/reading-progress', auth('student', 'admin'), getUserReadingProgress);

// Update last read chapter
userRouter.post('/update-last-read', auth('student', 'admin'), updateLastReadChapter);

// Mark chapter as complete
userRouter.post('/mark-chapter-complete', auth('student', 'admin'), markChapterComplete);

// Update profile
userRouter.patch('/update-profile', auth('student', 'admin'), updateProfile);

// Statistics routes
userRouter.get('/stats/overview', auth('student', 'admin'), getUserStats);
userRouter.get('/stats/quiz', auth('student', 'admin'), getQuizStats);
userRouter.get('/stats/weekly', auth('student', 'admin'), getWeeklyPerformance);

export default userRouter;
