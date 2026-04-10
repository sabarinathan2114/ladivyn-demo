import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Categories
router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:id')
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

// Subcategories
// Either GET all subcategories, or GET subcategories belonging to a specific category
router.get('/subcategories', getSubcategories);
router.route('/subcategories/:id')
  .put(protect, admin, updateSubcategory)
  .delete(protect, admin, deleteSubcategory);

router.route('/:categoryId/subcategories')
  .get(getSubcategories)
  .post(protect, admin, createSubcategory);

export default router;
