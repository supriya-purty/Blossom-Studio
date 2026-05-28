const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const { notifyUserAndAdmin } = require("../utils/notificationService");

const ensureCategoryForProduct = async (productData) => {
  if (!productData.category) return;

  const existing = await Category.findOne({ apiCategory: productData.category });
  if (existing) return;

  await Category.create({
    name: productData.category,
    apiCategory: productData.category,
    subtitle: "Handmade collection",
    image: productData.images?.[0]?.url || "/blossom-hero-crochet-pipecleaner.png"
  });
};

const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const query = { ...keyword, ...category };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Product.countDocuments(query);

    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { recentlyViewed: product._id }
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { recentlyViewed: { $each: [product._id], $position: 0, $slice: 8 } }
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(4);

    res.json({ product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    await ensureCategoryForProduct(req.body);
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    await ensureCategoryForProduct(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.files?.image) {
      res.status(400);
      throw new Error("Image file is required");
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: "blossom-studio/products"
    });

    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const alreadyReviewed = product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

    await product.save();
    await notifyUserAndAdmin({
      type: "product_review",
      user: req.user,
      subject: `New review for ${product.name}`,
      message: `${req.user.name} rated ${product.name} ${rating}/5 and wrote: ${comment}`
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  createReview
};
