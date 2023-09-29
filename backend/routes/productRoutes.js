import express from 'express';
import { getProducts, getProductById, createProductReview, getTopProducts, createProduct, updateProduct, deleteProduct, getTotalProducts,getAllProducts } from '../controllers/productController.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Product from '../models/productModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();
router.route('/total-products').get(protect,admin,getTotalProducts);
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/all-products').get(getAllProducts);
router.get('/list', async (req, res) => {
  try {
    const products = await Product.find({}, '_id name image ');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);


export default router;