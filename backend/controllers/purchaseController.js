import Purchase from '../models/purchaseModel.js';
import asyncHandler from "../middleware/asyncHandler.js";
// @route   GET /api/purchases
// @access  Public
const getPurchases = asyncHandler(async(req,res) => { 
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
    const purchases = await Purchase.find({ ...keyword })
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
  const purchase = new Purchase({
    name: 'Sample Name',
    brand: 'Sample Brand',
    category: 'Sample Category',
    date: new Date('2023-09-21'),
    cost: 0
  })

  const createdPurchase = await purchase.save();
  res.status(201).json(createdPurchase);
});

// @desc    Update a purchase
// @route   PUT /api/purchases/:id
// @access  Private/Admin
const updatePurchase = asyncHandler(async (req, res) => {
    const { name, brand, category, date, cost } = req.body;
  
    const purchase = await Purchase.findById(req.params.id);
  
    if (purchase) {
      purchase.name = name;
      purchase.brand = brand;
      purchase.category = category;
      purchase.date = date;
      purchase.cost = cost;
  
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
  
  export {getPurchases,getPurchaseById,createPurchase,updatePurchase,deletePurchase};