import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  addChapter,
  createBook,
  getAllBooks,
  getBookById,
  getChapter,
  
} from '../controllers/bookController.js';

const bookRouter = express.Router();

// Admin routes
bookRouter.post('/create-book', auth('admin'), createBook);

// Student and Admin routes
bookRouter.get('/get-books', auth('student', 'admin'), getAllBooks);
bookRouter.get('/:id', auth('student', 'admin'), getBookById);


// chapter

//add chapter

bookRouter.post('/add-chapter', auth(  'admin'), addChapter) 

//// chapter
bookRouter.get('/get-chapter/:bookId' , auth('student', 'admin'), getChapter) 
export default bookRouter;