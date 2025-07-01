const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const vendorController = require("../controllers/vendorController");

// Create product with image upload
router.post("/products", upload.single("image"), vendorController.createProduct);

// Get approved & rejected products
router.get("/products/approved", vendorController.getApprovedProducts);
router.get("/products/rejected", vendorController.getRejectedProducts);

// Get pending orders
router.get("/orders/pending", vendorController.getNearbyPendingOrders );

// Confirm order
router.patch("/orders/:id/confirm", vendorController.confirmOrder);

router.get("/my-orders", vendorController.getMyOrders);
router.patch("/order-status/:id", vendorController.updateOrderStatus);

router.get("/products/pending", vendorController.getMyPendingProducts);



module.exports = router;

