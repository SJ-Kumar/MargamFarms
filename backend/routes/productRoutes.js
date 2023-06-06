import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;