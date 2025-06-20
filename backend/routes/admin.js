const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/products/pending", adminController.getPendingProducts);
router.patch("/products/:id/:status", adminController.updateProductStatus);
router.get("/products/approved", adminController.getApprovedProducts);
router.get("/products/rejected", adminController.getRejectedProducts);

router.get("/users/vendors", adminController.getAllVendors);
router.get("/users/organizers", adminController.getAllOrganizers);
router.get("/products/all", adminController.getAllProducts);

module.exports = router;
