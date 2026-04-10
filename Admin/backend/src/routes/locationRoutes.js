import express from 'express';
import { 
  getStates,
  getDistricts,
  getCities,
  getPincodes,
  getAllDistricts,
  getAllCities,
  getAllPincodes,
  createState,
  updateState,
  deleteState,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  createCity,
  updateCity,
  deleteCity,
  createPincode,
  updatePincode,
  deletePincode,
  bulkUploadLocations
} from '../controllers/locationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config for bulk upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /xlsx|xls|csv|json/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb('Spreadsheets or JSON files only (xlsx, xls, csv, json)!');
    }
  }
});

router.route('/states')
  .get(getStates)
  .post(protect, admin, createState);

router.route('/states/:id')
  .put(protect, admin, updateState)
  .delete(protect, admin, deleteState);

router.get('/states/:stateId/districts', getDistricts);

router.route('/districts')
  .get(getAllDistricts)
  .post(protect, admin, createDistrict);

router.route('/districts/:id')
  .put(protect, admin, updateDistrict)
  .delete(protect, admin, deleteDistrict);

router.get('/districts/:districtId/cities', getCities);

router.route('/cities')
  .get(getAllCities)
  .post(protect, admin, createCity);

router.route('/cities/:id')
  .put(protect, admin, updateCity)
  .delete(protect, admin, deleteCity);

router.get('/cities/:cityId/pincodes', getPincodes);

router.route('/pincodes')
  .get(getAllPincodes)
  .post(protect, admin, createPincode);

router.route('/pincodes/:id')
  .put(protect, admin, updatePincode)
  .delete(protect, admin, deletePincode);

router.post('/bulk-upload', protect, admin, upload.single('file'), bulkUploadLocations);

export default router;
