import express from "express";
import { getPurchases,getPurchaseById,createPurchase,updatePurchase,deletePurchase, getTotalPurchases, getRecentPurchases } from "../controllers/purchaseController.js";
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Purchase from '../models/purchaseModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getPurchases).post(protect, admin, createPurchase);
router.route('/total-purchases').get(protect,admin,getTotalPurchases);
router.route('/recent-purchases').get(protect,admin,getRecentPurchases);
router.get('/list', async (req, res) => {
    try {
      const purchases = await Purchase.find({}, '_id name ');
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.route('/:id').get(getPurchaseById).put(protect, admin, updatePurchase).delete(protect, admin, deletePurchase);


  router
  .route('/:id')
  .get(checkObjectId, getPurchaseById)
  .put(protect, admin, checkObjectId, updatePurchase)
  .delete(protect, admin, checkObjectId, deletePurchase);

  export default router;