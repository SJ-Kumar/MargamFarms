import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Razorpay from 'razorpay';


const razorpay = new Razorpay({
  key_id: 'rzp_test_4fe6t6EDDMh9vb', // Replace with your actual Razorpay API key
  key_secret: 'tArwkN0GD3NtziQo9XwtEEKU', // Replace with your actual Razorpay API secret
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount, // Amount in paisa
      currency,
      receipt,
    };

    razorpay.orders.create(options, (error, order) => {
      if (error) {
        res.status(500).json({ error: 'Failed to create Razorpay order' });
      } else {
        res.status(200).json({ orderId: order.id });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    for (const orderItem of createdOrder.orderItems) {
      const product = await Product.findById(orderItem.product);
  
      if (product) {
        // Decrease countInStock by the quantity in the order
        product.countInStock -= orderItem.qty;
  
        // Save the updated product
        await product.save();
      }
    }

    

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email mobile'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

const getCurrentOrders = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentYear, currentDate.getMonth() + 1, 0);

    // Find orders that match the criteria
    const orders = await Order.find({
      $or: [
        {
          // Orders of the current month
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
        {
          // Orders without paidAt or deliveredAt for the current year
          $or: [
            { paidAt: { $exists: false } },
            { deliveredAt: { $exists: false } },
          ],
          createdAt: {
            $gte: new Date(currentYear, 0, 1), // January 1st of the current year
            $lte: new Date(currentYear, 11, 31), // December 31st of the current year
          },
        },
      ],
      
    }).populate('user', 'id name');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductSales = async (req, res) => {
  try {
    const { years, months } = req.body;

    const pipeline = [];

    // Default to current year if not provided
    const currentYear = new Date().getFullYear();

    // Default to current month if not provided
    const currentMonth = new Date().getMonth() + 1; // Adding 1 because months are 0-based

    // Match orders with the selected years or default to current year
    const yearFilters = years && years.length > 0 ? years.map((year) => parseInt(year)) : [currentYear];
    
    // Match orders with the selected months or default to current month if year is selected
    const monthFilters = months && months.length > 0 ? months.map((month) => parseInt(month)) : [currentMonth];
    
    if (years && years.length > 0 && months && months.length > 0) {
      // If both year and month are selected, filter for the selected year and month
      pipeline.push({
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: '$paidAt' }, yearFilters[0]] }, // Assuming only one year is selected
              { $eq: [{ $month: '$paidAt' }, monthFilters[0]] }, // Assuming only one month is selected
            ]
          }
        },
      });
    } else {
      // If only year is selected or only month is selected or neither is selected, use the filters for year and month accordingly
      pipeline.push({
        $match: {
          $expr: { $in: [{ $year: '$paidAt' }, yearFilters] },
        },
      });
      
      if (!years || years.length === 0) {
        pipeline.push({
          $match: {
            $expr: { $in: [{ $month: '$paidAt' }, monthFilters] },
          },
        });
      }
    }

    // Group and aggregate sales data
    pipeline.push(
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: '$orderItems.product',
          value: { $sum: '$orderItems.qty' },
        },
      },
      {
        $lookup: {
          from: 'products', // Your product collection name
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          id: { $arrayElemAt: ['$productInfo.name', 0] },
          label: { $arrayElemAt: ['$productInfo.name', 0] },
          value: 1,
          color: {
            $switch: {
              branches: [
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Organic Coconut Oil'] }, then: 'hsl(162, 70%, 50%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Organic Groundnuts'] }, then: 'hsl(45, 70%, 20%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Organic Mangoes'] }, then: 'hsl(291, 70%, 50%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Lemon'] }, then: 'hsl(344, 70%, 50%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Turmeric Powder'] }, then: 'hsl(344, 70%, 50%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Organic Groundnut Oil'] }, then: 'hsl(344, 70%, 50%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Organic Sesame Oil'] }, then: 'hsl(30, 70%, 20%)' },
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'Guava'] }, then: 'hsl(162, 70%, 50%)' },
                // Add more cases for other labels if needed
                { case: { $eq: [{ $arrayElemAt: ['$productInfo.name', 0] }, 'default'] }, then: 'hsl(0, 0%, 50%)' },
              ],
              default: 'hsl(0, 0%, 50%)', // Default color if label is not found in the cases
            },
          },
        },
      }
    );

    // Execute the aggregation pipeline
    const productSales = await Order.aggregate(pipeline);

    // Format the response to match the desired order
    const formattedResponse = productSales.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
      color: item.color,
    }));

    res.json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/* const yearsList = async (req, res) => {
  try {
    const years = await Order.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$year"
        }
      }
    ]);

    // Extract the unique years from the result
    const yearsArray = years.map((yearObject) => yearObject._id);

    res.status(200).json({ status: "success", yearsList: yearsArray });
  } catch (err) {
    res.status(500).json({ status: "failure", msg: err.message });
  }
}; */
function getHSLColor(str) {
  // Calculate the HSL values based on the string (you can modify this as needed)
  const hash = str.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + acc;
  }, 0);
  const hue = hash % 360;
  return `${hue}, 70%, 50%`;
}
const getRevenueByProduct = async (req, res) => {
  try {
    // Fetch distinct years from the paidAt field
    const distinctYears = await Order.distinct('paidAt', {
      isPaid: true,
      paidAt: { $exists: true }, // Only consider orders with a paidAt date
    });
    //console.log("Distinct YEar:",distinctYears);

    // Calculate revenue by product for each distinct year
    const revenueData = [];

    const processedYears = new Set();

    for (const year of distinctYears) {
      const currentYear = year.getUTCFullYear();

      if (processedYears.has(currentYear)) {
        // If we've already processed this year, skip it
        continue;
      }

      const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

      const orders = await Order.find({
        isPaid: true,
        paidAt: { $gte: startOfYear, $lte: endOfYear },
      }).populate('orderItems.product');

      const revenueByProduct = {};
      let totalRevenue = 0; 

      orders.forEach((order) => {
        order.orderItems.forEach((item) => {
          const { name, price, qty } = item.product;
          //console.log("price of item:",item);
          if (!revenueByProduct[name]) {
            revenueByProduct[name] = 0;
          }
          //console.log("price of item",item.product.price);
          revenueByProduct[name] += item.price * item.qty;
          totalRevenue += item.price * item.qty; 
        });
      });

      revenueData.push({
        id: currentYear.toString(),
        color: `hsl(${getHSLColor(currentYear.toString())})`,
        data: Object.keys(revenueByProduct).map((productName) => ({
          x: productName,
          y: revenueByProduct[productName],
        })),
        totalRevenue: totalRevenue,
      });

      // Mark this year as processed
      processedYears.add(currentYear);
    }

    res.json(revenueData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getRecentOrders = asyncHandler(async (req, res) => {
  const recentOrders = await Order.find({
    isPaid: true,
    paidAt: { $exists: true },
  })
    .sort({ paidAt: -1 })
    .limit(8)
    .populate('user', 'name');

  const recentOrderData = recentOrders.map((order) => ({
    txId: order._id,
    user: order.user.name, 
    date: order.paidAt.toISOString().slice(0, 10),
    cost:  `₹ ${order.totalPrice.toFixed(0)}`,
  }));

  res.json(recentOrderData);
});

const getTotalOrdersYear = asyncHandler(async (req,res) => {
  try {
    const currentYear = new Date().getFullYear();
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      res.json({ totalOrders: result[0].totalOrders });
    } else {
      // No orders found for the current year
      res.json({ totalOrders: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export {
  createRazorpayOrder,
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getProductSales,
  getRevenueByProduct,
  getRecentOrders,
  getCurrentOrders,
  getTotalOrdersYear,
};