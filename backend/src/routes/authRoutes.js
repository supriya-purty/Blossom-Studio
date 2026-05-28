const express = require("express");
const { login, profile, register, updateWishlist } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.patch("/wishlist", protect, updateWishlist);

module.exports = router;
