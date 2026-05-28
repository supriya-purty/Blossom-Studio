const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(cart || { user: req.user._id, items: [] });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      res.status(400);
      throw new Error("Product unavailable or out of stock");
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const item = cart.items.find((line) => line.product.toString() === productId);
    if (item) item.quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart?.items.find((line) => line.product.toString() === req.params.productId);
    if (!item) {
      res.status(404);
      throw new Error("Cart item not found");
    }
    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ user: req.user._id, items: [] });
    cart.items = cart.items.filter((line) => line.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate("items.product");
    return res.json(cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: "" });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
