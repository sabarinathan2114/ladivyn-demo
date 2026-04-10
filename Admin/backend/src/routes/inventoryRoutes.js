import express from 'express';
import { 
  getInventoryLogs, 
  addInventoryLog 
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getInventoryLogs)
  .post(protect, admin, addInventoryLog);

export default router;
