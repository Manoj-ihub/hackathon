const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");

router.post("/orders", organizerController.createOrder);
router.get("/orders", organizerController.getMyOrders);
router.get("/products/recent", organizerController.getRecentProducts);

module.exports = router;
