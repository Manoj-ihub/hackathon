const Product = require("../models/product");
const Order = require("../models/order");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, vendorEmail } = req.body;
    const image = req.file ? req.file.path : null;

    const product = new Product({
      name,
      description,
      price,
      vendorEmail,
      image
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get approved products for vendor
exports.getApprovedProducts = async (req, res) => {
  const { email } = req.query;
  const products = await Product.find({ vendorEmail: email, status: "approved" });
  res.json(products);
};

// Get rejected products for vendor
exports.getRejectedProducts = async (req, res) => {
  const { email } = req.query;
  const products = await Product.find({ vendorEmail: email, status: "rejected" });
  res.json(products);
};

// Get pending orders visible to vendor
exports.getPendingOrders = async (req, res) => {
  const { email } = req.query;
  const orders = await Order.find({
    status: "pending",
    rejected: { $ne: email },
    vendorEmail: null
  }).populate("products.productId");
  res.json(orders);
};

// Confirm an order
exports.confirmOrder = async (req, res) => {
  const { id } = req.params;
  const { vendorEmail } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (order.status !== "pending") {
    return res.status(400).json({ error: "Order already confirmed or processed" });
  }

  console.log("The Vendor Email", vendorEmail)

  order.vendorEmail = vendorEmail;
  order.status = "confirmed";
  await order.save();

  res.json({ message: "Order confirmed", order });
};

// Get confirmed or delivered orders for vendor
exports.getMyOrders = async (req, res) => {
  const { email } = req.query;
  const orders = await Order.find({
    vendorEmail: email,
    status: { $in: ["confirmed", "packed", "out_for_delivery", "delivered"] }
  }).populate("products.productId");

  res.json(orders);
};

// Update order status to next stage
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const nextStatus = {
    confirmed: "packed",
    packed: "out_for_delivery",
    out_for_delivery: "delivered",
    delivered: null
  };

  const currentStatus = order.status;
  const updatedStatus = nextStatus[currentStatus];

  if (!updatedStatus) {
    return res.status(400).json({ error: "Order already delivered" });
  }

  order.status = updatedStatus;
  await order.save();

  res.json({ message: `Order marked as ${updatedStatus}`, order });
};
