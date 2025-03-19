import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  createPlan, 
  getAllPlans, 
  updatePlan 
} from '../controllers/subscriptionPlanController.js';

const router = express.Router();

// Admin route
router.post('/create', auth('admin'), createPlan);
router.patch('/update/:id', auth('admin'), updatePlan);

// Public route
router.get('/all', getAllPlans);

export default router;