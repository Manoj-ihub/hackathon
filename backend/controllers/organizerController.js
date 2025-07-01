const Order = require("../models/order");
const Product = require("../models/product");

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { organizerEmail, products, latitude, longitude } = req.body;

    let place = "Unknown Location";

    const order = new Order({
      organizerEmail,
      products,
      status: "pending",
      rejected: [],
      vendorEmail: null,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      place,
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
// exports.getRecentProducts = async (req, res) => {
//   const { latitude, longitude } = req.query;
//   const products = await Product.find({ status: "approved" }).sort({ createdAt: -1 }).limit(10);
//   res.json(products);
// };

// Get recent approved products within 20 km
exports.getRecentProducts = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  try {
    const products = await Product.find({
      status: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat]
          },
          $maxDistance: 20000 // 20 km in meters
        }
      }
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(products);
  } catch (err) {
    console.error("Error fetching nearby products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
