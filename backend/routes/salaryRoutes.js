import express from "express";
import { getSalarys,getSalaryById,createSalary,updateSalary,deleteSalary,getTotalSalarys} from "../controllers/salaryController.js";
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Salary from '../models/salaryModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getSalarys).post(protect, admin, createSalary);
router.route('/total-salarys').get(protect,admin,getTotalSalarys);
router.get('/list', async (req, res) => {
    try {
      const salarys = await Salary.find({}, '_id name ');
      res.json(salarys);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.route('/:id').get(getSalaryById).put(protect, admin, updateSalary).delete(protect, admin, deleteSalary);


  router
  .route('/:id')
  .get(checkObjectId, getSalaryById)
  .put(protect, admin, checkObjectId, updateSalary)
  .delete(protect, admin, checkObjectId, deleteSalary);

  export default router;