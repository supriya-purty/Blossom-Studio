const express = require("express");
const {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} = require("../controllers/categoryController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
