import express from "express";
import { getTransportById,getTransports,createTransport,updateTransport,deleteTransport,getTotalTransports } from "../controllers/transportController.js";
import { errorHandler } from '../middleware/errorMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Transport from '../models/transportModel.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();


router.route('/').get(getTransports).post(protect, admin, createTransport);
router.route('/total-transports').get(protect,admin,getTotalTransports);
router.get('/list', async (req, res) => {
    try {
      const transports = await Transport.find({}, '_id name ');
      res.json(transports);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.route('/:id').get(getTransportById).put(protect, admin, updateTransport).delete(protect, admin, deleteTransport);


  router
  .route('/:id')
  .get(checkObjectId, getTransportById)
  .put(protect, admin, checkObjectId, updateTransport)
  .delete(protect, admin, checkObjectId, deleteTransport);

  export default router;