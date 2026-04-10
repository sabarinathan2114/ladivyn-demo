import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  placeOrder,
  updateOrderStatus,
  addPaymentRecord
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, placeOrder);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id/payments')
  .post(protect, addPaymentRecord);

export default router;
