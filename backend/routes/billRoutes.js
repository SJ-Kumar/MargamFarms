import express from "express";
import { getBills,getBillById,createBill,updateBill,deleteBill,getTotalBills} from "../controllers/billController.js";
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Bill from '../models/billModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getBills).post(protect, admin, createBill);
router.route('/total-bills').get(protect,admin,getTotalBills);
router.get('/list', async (req, res) => {
    try {
      const bills = await Bill.find({}, '_id ');
      res.json(bills);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.route('/:id').get(getBillById).put(protect, admin, updateBill).delete(protect, admin, deleteBill);


  router
  .route('/:id')
  .get(checkObjectId, getBillById)
  .put(protect, admin, checkObjectId, updateBill)
  .delete(protect, admin, checkObjectId, deleteBill);

  export default router;