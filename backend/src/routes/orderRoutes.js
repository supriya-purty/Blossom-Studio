const express = require("express");
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
