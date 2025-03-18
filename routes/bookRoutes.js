import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  createBook, 
  getAllBooks, 
  getBookById 
} from '../controllers/bookController.js';

const bookRouter = express.Router();

// Admin routes
bookRouter.post('/create-book', auth('admin'), createBook);

// Student and Admin routes
bookRouter.get('/get-books', auth('student' , 'admin'), getAllBooks);
bookRouter.get('/:id', auth('student', 'admin'), getBookById);

export default bookRouter;