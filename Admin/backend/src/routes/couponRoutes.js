import express from 'express';
import { 
  getCoupons, 
  validateCoupon,
  createCoupon, 
  updateCoupon, 
  deleteCoupon 
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/validate/:code', validateCoupon);

router.route('/')
  .get(getCoupons)
  .post(protect, admin, createCoupon);

router.route('/:id')
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

export default router;
