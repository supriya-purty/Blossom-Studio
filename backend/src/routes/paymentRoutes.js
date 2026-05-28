const express = require("express");
const {
  createRazorpayOrder,
  getPayments,
  verifyPayment
} = require("../controllers/paymentController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/razorpay-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.get("/", protect, adminOnly, getPayments);

module.exports = router;
