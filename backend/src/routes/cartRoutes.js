const express = require("express");
const {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
