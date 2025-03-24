import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  createPlan, 
  deletePlan, 
  getAllPlans, 
  getAPlan, 
  updatePlan 
} from '../controllers/subscriptionPlanController.js';

const router = express.Router();

// Admin route
router.post('/create', auth('admin'), createPlan);
router.patch('/update/:id', auth('admin'), updatePlan);
router.delete('/delete/:id', auth('admin'), deletePlan);
// Public route
router.get('/all', getAllPlans);
router.get('/:id', getAPlan)

export default router;