import Transport from '../models/transportModel.js';
import asyncHandler from "../middleware/asyncHandler.js";
// @route   GET /api/transports
// @access  Public
const getTransports = asyncHandler(async(req,res) => { 
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
  
    const count = await Transport.countDocuments({ ...keyword });
    const transports = await Transport.find({ ...keyword,
      date: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ transports, page, pages: Math.ceil(count / pageSize) });
  });

  // @desc    Fetch single transport
// @route   GET /api/transports/:id
// @access  Public
const getTransportById = asyncHandler(async(req,res) => { 
    const transport=await Transport.findById(req.params.id);
    if(transport){
        return res.json(transport)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a transport
// @route   POST /api/transports/:id
// @access  Private/admin
const createTransport = asyncHandler(async(req,res) => { 
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const transport = new Transport({
    name: 'Sample Name',
    qty: '0KG',
    date: new Date(`${currentYear}-09-21`),
    cost: 0,
    description: 'Sample Description',
  })

  const createdTransport = await transport.save();
  res.status(201).json(createdTransport);
});

// @desc    Update a transport
// @route   PUT /api/transports/:id
// @access  Private/Admin
const updateTransport = asyncHandler(async (req, res) => {
    const { name,qty, date, cost, description } = req.body;
  
    const transport = await Transport.findById(req.params.id);
  
    if (transport) {
      transport.name = name;
      transport.qty = qty;
      transport.date = date;
      transport.cost = cost;
      transport.description = description;
  
      const updatedTransport = await transport.save();
      res.json(updatedTransport);
    } else {
      res.status(404);
      throw new Error('Transport not found');
    }
  });
// @desc    Delete a transport
// @route   DLETE /api/transports/:id
// @access  Private/Admin
const deleteTransport = asyncHandler(async(req,res) => { 
    const transport = await Transport.findById(req.params.id);
  
    if(transport) {
      await Transport.deleteOne({_id: transport._id});
      res.status(200).json({message: 'Transport Deleted'});
    } else {
      res.status(404);
      throw new Error('Resource not found');
    }
  
  });

  const getTotalTransports = asyncHandler(async (req,res) => {
    try {
      const currentYear = new Date().getFullYear();
      const transports = await Transport.find({
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      });
      const totalCost = transports.reduce((acc, transport) => acc + transport.cost, 0);
  
      res.json({ totalCost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  export {getTransports,getTransportById,createTransport,updateTransport,deleteTransport,getTotalTransports };