import asyncHandler from "../middleware/asyncHandler.js";
import Product from '../models/productModel.js';
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async(req,res) => { 
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

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async(req,res) => { 
    const product=await Product.findById(req.params.id);
    if(product){
        return res.json(product)
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a product
// @route   POST /api/products/:id
// @access  Private/admin
const createProduct = asyncHandler(async(req,res) => { 
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/Mango.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStocks: 0,
    description: 'Sample Description',
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, anonymous } = req.body; // Get anonymous from the request body

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if the user is signed in and not posting anonymously
    if  (!anonymous && req.user && req.user._id) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user && r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }
    }

    const review = {
      name: anonymous ? 'Anonymous' : req.user.name, // Set reviewer name to "Anonymous" if anonymous is true
      rating: Number(rating),
      comment,
      user: anonymous ? null : req.user._id, // Set user to null if anonymous
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
// @desc    Delete a products
// @route   DLETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async(req,res) => { 
  const product = await Product.findById(req.params.id);

  if(product) {
    await Product.deleteOne({_id: product._id});
    res.status(200).json({message: 'Product Deleted'});
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }

});

const getTotalProducts = asyncHandler(async (req,res) => {
  try {
    const productCount = await Product.countDocuments();
    res.json({ totalProducts: productCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
  });

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export {getProducts, getProductById, createProductReview, getTopProducts, createProduct, updateProduct, deleteProduct, getTotalProducts,getAllProducts};