import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  addUserAddress 
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(admin, getUsers);

router.route('/:id')
  .get(admin, getUserById)
  .put(admin, updateUser)
  .delete(admin, deleteUser);

router.route('/:id/addresses')
  .post(addUserAddress);

export default router;
