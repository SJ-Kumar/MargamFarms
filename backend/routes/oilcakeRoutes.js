import express from "express";
import { getOilcakes,getOilcakeById,createOilcake,updateOilcake,deleteOilcake,getTotalOilcakes } from "../controllers/oilcakeController.js";
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import OilCake from '../models/oilcakeModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getOilcakes).post(protect, admin, createOilcake);
router.route('/total-oilcakes').get(protect,admin,getTotalOilcakes);
router.get('/list', async (req, res) => {
    try {
      const oilcakes = await OilCake.find({}, '_id name ');
      res.json(oilcakes);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.route('/:id').get(getOilcakeById).put(protect, admin, updateOilcake).delete(protect, admin, deleteOilcake);


  router
  .route('/:id')
  .get(checkObjectId, getOilcakeById)
  .put(protect, admin, checkObjectId, updateOilcake)
  .delete(protect, admin, checkObjectId, deleteOilcake);

  export default router;