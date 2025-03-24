import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  createNotice, 
  getNotices, 
  updateNotice, 
  deleteNotice 
} from '../controllers/noticeController.js';

const noticeRouter = express.Router();

 
noticeRouter.post('/create', auth('admin'), createNotice);
noticeRouter.put('/update/:noticeId', auth('admin'), updateNotice);
noticeRouter.delete('/delete/:noticeId', auth('admin'), deleteNotice);

 
noticeRouter.get('/get-notices', auth('student', 'admin'), getNotices);

export default noticeRouter;