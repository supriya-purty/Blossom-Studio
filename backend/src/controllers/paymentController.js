const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { notifyUserAndAdmin } = require("../utils/notificationService");

const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      res.status(500);
      throw new Error("Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment variables.");
    }

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `blossom_${order._id}`
    });

    const payment = await Payment.create({
      order: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      status: "created"
    });

    order.payment = payment._id;
    await order.save();

    res.json({ razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      res.status(400);
      throw new Error("Payment verification failed");
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "captured"
      },
      { new: true }
    );

    const order = await Order.findByIdAndUpdate(payment.order, { paymentStatus: "Paid" }, { new: true })
      .populate("user", "name email phoneNumber");

    if (order?.user) {
      await notifyUserAndAdmin({
        type: "payment_success",
        user: order.user,
        subject: `Blossom Studio payment received #${order._id.toString().slice(-6)}`,
        message: `Hi ${order.user.name}, your payment of Rs ${order.totalAmount} was received successfully.`
      });
    }

    res.json({ message: "Payment verified", payment });
  } catch (error) {
    next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate("order").sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRazorpayOrder, verifyPayment, getPayments };
