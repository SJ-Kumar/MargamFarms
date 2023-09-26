import express from "express";
import { getExpenses,getExpenseById,createExpense,updateExpense,deleteExpense,getTotalExpenses} from "../controllers/expenseController.js";
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Expense from '../models/expenseModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getExpenses).post(protect, admin, createExpense);
router.route('/total-expenses').get(protect,admin,getTotalExpenses);
router.get('/list', async (req, res) => {
    try {
      const expenses = await Expense.find({}, '_id name ');
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.route('/:id').get(getExpenseById).put(protect, admin, updateExpense).delete(protect, admin, deleteExpense);


  router
  .route('/:id')
  .get(checkObjectId, getExpenseById)
  .put(protect, admin, checkObjectId, updateExpense)
  .delete(protect, admin, checkObjectId, deleteExpense);

  export default router;