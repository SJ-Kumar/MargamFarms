import Bill from '../models/billModel.js';
import asyncHandler from "../middleware/asyncHandler.js";
// @route   GET /api/bills
// @access  Public
/* const getBills = asyncHandler(async (req, res) => {
    const currentYear = new Date().getFullYear();
  
    const bills = await Bill.find({
      from_date: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    });
  
    res.json({bills});
  });
   */
  const getBills = asyncHandler(async(req,res) => { 
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
  
    const count = await Bill.countDocuments({ ...keyword });
    const bills = await Bill.find({ ...keyword,
        from_date: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
     })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ bills, page, pages: Math.ceil(count / pageSize) });
  });

  // @desc    Fetch single bill
// @route   GET /api/bills/:id
// @access  Public
const getBillById = asyncHandler(async(req,res) => { 
    const bill=await Bill.findById(req.params.id);
    if(bill){
        return res.json(bill)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a bill
// @route   POST /api/bills/:id
// @access  Private/admin
const createBill = asyncHandler(async(req,res) => { 
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const bill = new Bill({
    from_date: new Date(`${currentYear}-09-21`),
    to_date: new Date(`${currentYear}-11-21`),
    cost: 0,
    description: 'Sample Description',
  })

  const createdBill = await bill.save();
  res.status(201).json(createdBill);
});

// @desc    Update a bill
// @route   PUT /api/bills/:id
// @access  Private/Admin
const updateBill = asyncHandler(async (req, res) => {
    const { from_date, to_date, cost, description } = req.body;
  
    const bill = await Bill.findById(req.params.id);
  
    if (bill) {
        bill.from_date = from_date;
      bill.to_date = to_date;
      bill.cost = cost;
      bill.description = description;
  
      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404);
      throw new Error('Bill not found');
    }
  });
// @desc    Delete a bill
// @route   DELETE /api/bills/:id
// @access  Private/Admin
const deleteBill = asyncHandler(async(req,res) => { 
    const bill = await Bill.findById(req.params.id);
  
    if(bill) {
      await Bill.deleteOne({_id: bill._id});
      res.status(200).json({message: 'Bill Deleted'});
    } else {
      res.status(404);
      throw new Error('Resource not found');
    }
  
  });

  const getTotalBills = asyncHandler(async (req,res) => {
    try {
      const currentYear = new Date().getFullYear();
      const bills = await Bill.find({
        from_date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      });
      const totalCost = bills.reduce((acc, bill) => acc + bill.cost, 0);
  
      res.json({ totalCost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  export {getBills,getBillById,createBill,updateBill,deleteBill,getTotalBills};