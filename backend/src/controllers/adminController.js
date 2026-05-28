const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const { hasSmtpConfig, sendMail } = require("../utils/notificationService");

const getDashboardStats = async (req, res, next) => {
  try {
    const [products, orders, users, payments] = await Promise.all([
      Product.countDocuments(),
      Order.find(),
      User.countDocuments({ role: "customer" }),
      Payment.find({ status: "captured" })
    ]);

    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const lowStock = await Product.find({ stock: { $lte: 5 } }).select("name stock category");
    const recentOrders = await Order.find().populate("user", "name").sort({ createdAt: -1 }).limit(6);

    res.json({
      products,
      orders: orders.length,
      users,
      revenue,
      lowStock,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const products = await Product.find({ "reviews.0": { $exists: true } })
      .select("name images reviews")
      .populate("reviews.user", "name email")
      .sort({ updatedAt: -1 });

    const feedback = products.flatMap((product) =>
      product.reviews.map((review) => ({
        _id: review._id,
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0]?.url,
        userName: review.name || review.user?.name,
        userEmail: review.user?.email,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }))
    );

    res.json(feedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const testEmail = async (req, res, next) => {
  try {
    if (!hasSmtpConfig()) {
      res.status(400);
      throw new Error("SMTP is not configured. Fill SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.");
    }

    const to = req.body.email || process.env.ADMIN_EMAIL;
    await sendMail({
      to,
      subject: "Blossom Studio SMTP test",
      message: "Gmail SMTP is working for Blossom Studio order and payment emails."
    });

    res.json({ message: `Test email sent to ${to}` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getCustomers, getFeedback, getNotifications, testEmail };
