const Category = require("../models/Category");
const Product = require("../models/Product");

const getCategories = async (req, res, next) => {
  try {
    const [savedCategories, productCategories] = await Promise.all([
      Category.find().sort({ createdAt: -1 }),
      Product.aggregate([
        { $group: { _id: "$category", productCount: { $sum: 1 }, images: { $first: "$images" } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const savedApiCategories = new Set(savedCategories.map((category) => category.apiCategory));
    const derivedCategories = productCategories
      .filter((category) => category._id && !savedApiCategories.has(category._id))
      .map((category) => ({
        name: category._id,
        apiCategory: category._id,
        subtitle: `${category.productCount} handmade product${category.productCount === 1 ? "" : "s"}`,
        image:
          category.images?.[0]?.url ||
          "/blossom-hero-crochet-pipecleaner.png",
        productCount: category.productCount,
        derivedFromProducts: true
      }));

    res.json([...savedCategories, ...derivedCategories]);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, apiCategory, subtitle, image } = req.body;
    const category = await Category.create({
      name,
      apiCategory: apiCategory || name,
      subtitle,
      image
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const current = await Category.findById(req.params.id);
    if (!current) {
      res.status(404);
      throw new Error("Category not found");
    }

    const previousApiCategory = current.apiCategory;
    current.name = req.body.name ?? current.name;
    current.apiCategory = req.body.apiCategory ?? current.apiCategory;
    current.subtitle = req.body.subtitle ?? current.subtitle;
    current.image = req.body.image ?? current.image;
    await current.save();

    if (previousApiCategory !== current.apiCategory) {
      await Product.updateMany(
        { category: previousApiCategory },
        { $set: { category: current.apiCategory } }
      );
    }

    res.json(current);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    const productCount = await Product.countDocuments({ category: category.apiCategory });
    if (productCount > 0) {
      res.status(400);
      throw new Error("Move or delete products in this category before deleting it.");
    }

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
