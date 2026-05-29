const express = require("express");
const {
  forgotPassword,
  login,
  profile,
  register,
  resetPassword,
  updateWishlist
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, profile);
router.patch("/wishlist", protect, updateWishlist);

module.exports = router;
