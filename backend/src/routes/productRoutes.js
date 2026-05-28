const express = require("express");
const {
  createProduct,
  createReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  uploadProductImage
} = require("../controllers/productController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, adminOnly, createProduct);
router.post("/upload", protect, adminOnly, uploadProductImage);
router.get("/:id", getProductById);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/:id/reviews", protect, createReview);

module.exports = router;
