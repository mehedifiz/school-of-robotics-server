import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  addChapter,
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getChapter,
  updateBook,
  updateChapter
  
} from '../controllers/bookController.js';

const bookRouter = express.Router();

// Admin routes
bookRouter.post('/create-book', auth('admin'), createBook);

// Student and Admin routes
bookRouter.get('/get-books', auth('student', 'admin'), getAllBooks);
bookRouter.get('/:id', auth('student', 'admin'), getBookById);
bookRouter.patch('/:id', auth('admin'), updateBook);
bookRouter.delete('/:id', auth('admin'), deleteBook);


// chapter

//add chapter

bookRouter.post('/add-chapter', auth(  'admin'), addChapter) 

//// chapter
bookRouter.get('/get-chapter/:bookId' , auth('student', 'admin'), getChapter) 

bookRouter.patch('/update-chapter/:chapterId', auth('admin'), updateChapter);
export default bookRouter;