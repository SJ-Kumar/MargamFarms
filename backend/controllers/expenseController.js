import Expense from '../models/expenseModel.js';
import asyncHandler from "../middleware/asyncHandler.js";
// @route   GET /api/expenses
// @access  Public
const getExpenses = asyncHandler(async(req,res) => { 
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
  
    const count = await Expense.countDocuments({ ...keyword });
    const expenses = await Expense.find({ ...keyword,
      date: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ expenses, page, pages: Math.ceil(count / pageSize) });
  });

  // @desc    Fetch single expense
// @route   GET /api/expenses/:id
// @access  Public
const getExpenseById = asyncHandler(async(req,res) => { 
    const expense=await Expense.findById(req.params.id);
    if(expense){
        return res.json(expense)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a expense
// @route   POST /api/expenses/:id
// @access  Private/admin
const createExpense = asyncHandler(async(req,res) => { 
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const expense = new Expense({
    name: 'Sample Name',
    date: new Date(`${currentYear}-09-21`),
    cost: 0,
    description: 'Sample Description',
  })

  const createdExpense = await expense.save();
  res.status(201).json(createdExpense);
});

// @desc    Update a expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = asyncHandler(async (req, res) => {
    const { name,date, cost, description } = req.body;
  
    const expense = await Expense.findById(req.params.id);
  
    if (expense) {
      expense.name = name;
      expense.date = date;
      expense.cost = cost;
      expense.description = description;
  
      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } else {
      res.status(404);
      throw new Error('Expense not found');
    }
  });
// @desc    Delete a expense
// @route   DLETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = asyncHandler(async(req,res) => { 
    const expense = await Expense.findById(req.params.id);
  
    if(expense) {
      await Expense.deleteOne({_id: expense._id});
      res.status(200).json({message: 'Expense Deleted'});
    } else {
      res.status(404);
      throw new Error('Resource not found');
    }
  
  });

  const getTotalExpenses = asyncHandler(async (req,res) => {
    try {
      const currentYear = new Date().getFullYear();
      const expenses = await Expense.find({
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      });
      const totalCost = expenses.reduce((acc, expense) => acc + expense.cost, 0);
  
      res.json({ totalCost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  export {getExpenseById,getExpenses,createExpense,updateExpense,deleteExpense,getTotalExpenses};