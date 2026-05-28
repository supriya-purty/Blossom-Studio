const express = require("express");
const {
  getCustomers,
  getDashboardStats,
  getFeedback,
  getNotifications,
  testEmail
} = require("../controllers/adminController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/customers", protect, adminOnly, getCustomers);
router.get("/feedback", protect, adminOnly, getFeedback);
router.get("/notifications", protect, adminOnly, getNotifications);
router.post("/test-email", protect, adminOnly, testEmail);

module.exports = router;
