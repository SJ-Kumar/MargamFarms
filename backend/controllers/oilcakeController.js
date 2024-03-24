import OilCake from '../models/oilcakeModel.js';
import asyncHandler from "../middleware/asyncHandler.js";
// @route   GET /api/oilcakes
// @access  Public
const getOilcakes = asyncHandler(async(req,res) => { 
  const currentYear = new Date().getFullYear();
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
  
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
  
    const count = await OilCake.countDocuments({ ...keyword });
    const oilcakes = await OilCake.find({ ...keyword,
      date: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ oilcakes, page, pages: Math.ceil(count / pageSize) });
  });

  // @desc    Fetch single oilcake
// @route   GET /api/oilcakes/:id
// @access  Public
const getOilcakeById = asyncHandler(async(req,res) => { 
    const oilcake=await OilCake.findById(req.params.id);
    if(oilcake){
        return res.json(oilcake)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a oilcake
// @route   POST /api/oilcakes/:id
// @access  Private/admin
const createOilcake = asyncHandler(async(req,res) => { 
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const oilcake = new OilCake({
    name: 'Sample Name',
    qty: '0KG',
    date: new Date(`${currentYear}-09-21`),
    cost: 0,
    description: 'Sample Description',
  })

  const createdOilcake = await oilcake.save();
  res.status(201).json(createdOilcake);
});

// @desc    Update a oilcake
// @route   PUT /api/oilcakes/:id
// @access  Private/Admin
const updateOilcake = asyncHandler(async (req, res) => {
    const { name,qty, date, cost, description } = req.body;
  
    const oilcake = await OilCake.findById(req.params.id);
  
    if (oilcake) {
      oilcake.name = name;
      oilcake.qty = qty;
      oilcake.date = date;
      oilcake.cost = cost;
      oilcake.description = description;
  
      const updatedOilcake = await oilcake.save();
      res.json(updatedOilcake);
    } else {
      res.status(404);
      throw new Error('Oilcake not found');
    }
  });
// @desc    Delete a oilcake
// @route   DLETE /api/oilcakes/:id
// @access  Private/Admin
const deleteOilcake = asyncHandler(async(req,res) => { 
    const oilcake = await OilCake.findById(req.params.id);
  
    if(oilcake) {
      await OilCake.deleteOne({_id: oilcake._id});
      res.status(200).json({message: 'Oilcake Deleted'});
    } else {
      res.status(404);
      throw new Error('Resource not found');
    }
  
  });

  const getTotalOilcakes = asyncHandler(async (req,res) => {
    try {
      const currentYear = new Date().getFullYear();
      const oilcakes = await OilCake.find({
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      });
      const totalCost = oilcakes.reduce((acc, oilcake) => acc + oilcake.cost, 0);
  
      res.json({ totalCost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  export {getOilcakes,getOilcakeById,createOilcake,updateOilcake,deleteOilcake, getTotalOilcakes};