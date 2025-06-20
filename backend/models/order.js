const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  organizerEmail: String,
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  vendorEmail: String, // gets filled when confirmed
  status: {
    type: String,
    enum: ["pending", "confirmed", "packed", "out_for_delivery", "delivered"],
    default: "pending"
  },
  rejected: [String] // vendor emails that rejected the order
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
