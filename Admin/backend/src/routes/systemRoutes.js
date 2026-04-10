import express from 'express';
import { 
  getAuditLogs, 
  createAuditLog,
  getBulkUploadLogs,
  createBulkUploadLog,
  getDashboardStats
} from '../controllers/systemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/audit-logs')
  .get(protect, admin, getAuditLogs)
  .post(protect, admin, createAuditLog);

router.get('/dashboard-stats', protect, admin, getDashboardStats);

router.route('/bulk-upload-logs')
  .get(protect, admin, getBulkUploadLogs)
  .post(protect, admin, createBulkUploadLog);

export default router;
