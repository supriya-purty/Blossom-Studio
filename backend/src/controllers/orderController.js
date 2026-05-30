const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const { notifyUserAndAdmin } = require("../utils/notificationService");
const mongoose = require("mongoose");

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, products: checkoutProducts, paymentMethod = "Cash on Delivery" } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    const hasCartItems = Boolean(cart?.items.length);
    const hasCheckoutProducts = Boolean(checkoutProducts?.length);

    if (!hasCartItems && !hasCheckoutProducts) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    const products = hasCartItems
      ? cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0]?.url,
          price: item.product.price,
          quantity: item.quantity
        }))
      : checkoutProducts.map((item) => ({
          product: mongoose.Types.ObjectId.isValid(item._id) ? item._id : undefined,
          name: item.name,
          image: item.images?.[0]?.url || item.image,
          price: Number(item.price),
          quantity: Number(item.quantity || 1)
        }));

    const itemsTotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = itemsTotal > 999 ? 0 : 79;
    const totalAmount = itemsTotal + shipping;

    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    await Promise.all(
      products
        .filter((item) => item.product)
        .map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }))
    );
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    const notificationUser = {
      ...req.user.toObject(),
      phoneNumber: req.user.phoneNumber || shippingAddress?.phoneNumber
    };

    await notifyUserAndAdmin({
      type: "order_created",
      user: notificationUser,
      subject: `Blossom Studio order placed #${order._id.toString().slice(-6)}`,
      message: `Hi ${req.user.name}, your order of Rs ${order.totalAmount} has been placed. Payment method: ${order.paymentMethod}. Current status: ${order.orderStatus}.`
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phoneNumber");
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = req.body.orderStatus;

    if (order.orderStatus === "Cancelled" && previousStatus !== "Cancelled") {
      order.paymentStatus = order.paymentStatus === "Paid" ? "Refunded" : "Failed";
      await Promise.all(
        order.products
          .filter((item) => item.product)
          .map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }))
      );
      if (order.payment) {
        await Payment.findByIdAndUpdate(order.payment, { status: "failed" });
      }
    }

    await order.save();

    await notifyUserAndAdmin({
      type: "order_status",
      user: order.user,
      subject: `Blossom Studio order status updated #${order._id.toString().slice(-6)}`,
      message: `Hi ${order.user.name}, your order status is now ${order.orderStatus}.`
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
