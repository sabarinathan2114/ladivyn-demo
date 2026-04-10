import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addProductImage,
  deleteProductImage,
  bulkUploadProducts
} from '../controllers/productController.js';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer config for bulk upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /xlsx|xls|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb('Spreadsheets only (xlsx, xls, csv)!');
    }
  }
});

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/images')
  .post(protect, admin, addProductImage);

router.delete('/:id/images/:imageId', protect, admin, deleteProductImage);

router.post('/bulk-upload', protect, admin, upload.single('file'), bulkUploadProducts);

export default router;
