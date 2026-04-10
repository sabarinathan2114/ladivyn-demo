import express from 'express';
import { 
  getReturns, 
  updateReturn 
} from '../controllers/returnController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getReturns);

router.route('/:id')
  .put(protect, admin, updateReturn);

export default router;
