import Salary from '../models/salaryModel.js';
import asyncHandler from "../middleware/asyncHandler.js";
// @route   GET /api/salarys
// @access  Public

  const getSalarys = asyncHandler(async(req,res) => { 
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
  
    const count = await Salary.countDocuments({ ...keyword });
    const salarys = await Salary.find({ ...keyword,
        from_date: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
     })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ salarys, page, pages: Math.ceil(count / pageSize) });
  });

  // @desc    Fetch single salary
// @route   GET /api/salarys/:id
// @access  Public
const getSalaryById = asyncHandler(async(req,res) => { 
    const salary=await Salary.findById(req.params.id);
    if(salary){
        return res.json(salary)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a salary
// @route   POST /api/salarys/:id
// @access  Private/admin
const createSalary = asyncHandler(async(req,res) => { 
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const salary = new Salary({
    name: 'Sample Name',
    from_date: new Date(`${currentYear}-09-21`),
    to_date: new Date(`${currentYear}-11-21`),
    cost: 0,
    description: 'Sample Description',
  })

  const createdSalary = await salary.save();
  res.status(201).json(createdSalary);
});

// @desc    Update a salary
// @route   PUT /api/salarys/:id
// @access  Private/Admin
const updateSalary = asyncHandler(async (req, res) => {
    const { name, from_date, to_date, cost, description } = req.body;
  
    const salary = await Salary.findById(req.params.id);
  
    if (salary) {
        salary.name = name;
        salary.from_date = from_date;
      salary.to_date = to_date;
      salary.cost = cost;
      salary.description = description;
  
      const updatedSalary = await salary.save();
      res.json(updatedSalary);
    } else {
      res.status(404);
      throw new Error('Salary not found');
    }
  });
// @desc    Delete a salary
// @route   DELETE /api/salarys/:id
// @access  Private/Admin
const deleteSalary = asyncHandler(async(req,res) => { 
    const salary = await Salary.findById(req.params.id);
  
    if(salary) {
      await Salary.deleteOne({_id: salary._id});
      res.status(200).json({message: 'Salary Deleted'});
    } else {
      res.status(404);
      throw new Error('Resource not found');
    }
  
  });

  const getTotalSalarys = asyncHandler(async (req,res) => {
    try {
      const currentYear = new Date().getFullYear();
      const salarys = await Salary.find({
        from_date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      });
      const totalCost = salarys.reduce((acc, salary) => acc + salary.cost, 0);
  
      res.json({ totalCost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  export {getSalarys,getSalaryById,createSalary,updateSalary,deleteSalary,getTotalSalarys};