const Order = require("../models/order");
const Product = require("../models/product");

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { organizerEmail, products } = req.body;

    const order = new Order({
      organizerEmail,
      products,
      status: "pending",
      rejected: [],
      vendorEmail: null
    });

    await order.save();
    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all orders of an organizer
exports.getMyOrders = async (req, res) => {
  const { email } = req.query;
  const orders = await Order.find({ organizerEmail: email }).populate("products.productId");
  res.json(orders);
};

// Get recent approved products
exports.getRecentProducts = async (req, res) => {
  const products = await Product.find({ status: "approved" }).sort({ createdAt: -1 }).limit(10);
  res.json(products);
};
