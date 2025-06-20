const Product = require("../models/product");
const User = require("../models/users"); // assuming your User model is here

// Get pending products
exports.getPendingProducts = async (req, res) => {
  const products = await Product.find({ status: "pending" });
  res.json(products);
};

// Approve/Reject product
exports.updateProductStatus = async (req, res) => {
  const { id, status } = req.params;
  const { rejectionReason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const update = { status };
  if (status === "rejected") {
    update.rejectionReason = rejectionReason || "Not specified";
  }

  const updated = await Product.findByIdAndUpdate(id, update, { new: true });
  res.json(updated);
};

// Get all approved products
exports.getApprovedProducts = async (req, res) => {
  const products = await Product.find({ status: "approved" });
  res.json(products);
};

// Get all rejected products
exports.getRejectedProducts = async (req, res) => {
  const products = await Product.find({ status: "rejected" });
  res.json(products);
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
  const vendors = await User.find({ role: "vendor" });
  res.json(vendors);
};

// Get all organizers
exports.getAllOrganizers = async (req, res) => {
  const organizers = await User.find({ role: "organizer" });
  res.json(organizers);
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
