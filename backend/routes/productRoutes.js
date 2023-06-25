import express from 'express';
import { getProducts, getProductById, createProductReview, getTopProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);
router.route('/:id').get(getProductById).put(protect, updateProduct).delete(protect, admin, deleteProduct);



export default router;