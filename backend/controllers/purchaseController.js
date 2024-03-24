import Purchase from '../models/purchaseModel.js';
import asyncHandler from "../middleware/asyncHandler.js";

// @route   GET /api/purchases
// @access  Public
const getPurchases = asyncHandler(async(req,res) => { 
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
  
    const count = await Purchase.countDocuments({ ...keyword });
    const purchases = await Purchase.find({ ...keyword,
      date: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ purchases, page, pages: Math.ceil(count / pageSize) });
  });

  // @desc    Fetch single purchase
// @route   GET /api/purchases/:id
// @access  Public
const getPurchaseById = asyncHandler(async(req,res) => { 
    const purchase=await Purchase.findById(req.params.id);
    if(purchase){
        return res.json(purchase)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a purchase
// @route   POST /api/purchases/:id
// @access  Private/admin
const createPurchase = asyncHandler(async(req,res) => { 
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const purchase = new Purchase({
    name: 'Sample Name',
    brand: 'Sample Brand',
    category: 'Sample Category',
    qty: '0KG',
    date: new Date(`${currentYear}-09-21`),
    cost: 0,
    description: 'Sample Description',
  })

  const createdPurchase = await purchase.save();
  res.status(201).json(createdPurchase);
});

// @desc    Update a purchase
// @route   PUT /api/purchases/:id
// @access  Private/Admin
const updatePurchase = asyncHandler(async (req, res) => {
    const { name, brand, category,qty, date, cost, description } = req.body;
  
    const purchase = await Purchase.findById(req.params.id);
  
    if (purchase) {
      purchase.name = name;
      purchase.brand = brand;
      purchase.category = category;
      purchase.qty = qty;
      purchase.date = date;
      purchase.cost = cost;
      purchase.description = description;
  
      const updatedPurchase = await purchase.save();
      res.json(updatedPurchase);
    } else {
      res.status(404);
      throw new Error('Purchase not found');
    }
  });
// @desc    Delete a purchase
// @route   DLETE /api/purchases/:id
// @access  Private/Admin
const deletePurchase = asyncHandler(async(req,res) => { 
    const purchase = await Purchase.findById(req.params.id);
  
    if(purchase) {
      await Purchase.deleteOne({_id: purchase._id});
      res.status(200).json({message: 'Purchase Deleted'});
    } else {
      res.status(404);
      throw new Error('Resource not found');
    }
  
  });

const getTotalPurchases = asyncHandler(async (req,res) => {
  try {
    const currentYear = new Date().getFullYear();
    const purchases = await Purchase.find({
      date: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`),
      },
    });
    const totalCost = purchases.reduce((acc, purchase) => acc + purchase.cost, 0);

    res.json({ totalCost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getRecentPurchases = asyncHandler(async (req, res) => {
  const recentPurchases = await Purchase.find({
    date: { $exists: true },
  })
    .sort({ date: -1 })
    .limit(8)

  const recentPurchaseData = recentPurchases.map((purchase) => ({
    txId: purchase.brand,
    user: purchase.name, 
    date: purchase.date.toISOString().slice(0, 10),
    cost:  `₹ ${purchase.cost.toFixed(0)}`,
  }));

  res.json(recentPurchaseData);
});
  
  export {getPurchases,getPurchaseById,createPurchase,updatePurchase,deletePurchase,getTotalPurchases, getRecentPurchases};