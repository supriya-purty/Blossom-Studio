const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendMail } = require("../utils/notificationService");

const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("Email already registered");
    }

    const user = await User.create({ name, email, password, phoneNumber, address });
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res) => {
  res.json(req.user);
};

const updateWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some((id) => id.toString() === productId);

    user.wishlist = exists
      ? user.wishlist.filter((id) => id.toString() !== productId)
      : [...user.wishlist, productId];

    await user.save();
    await user.populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Email is required.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: "If this email is registered, a password reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Reset your Blossom Studio password",
      message: `Hi ${user.name},\n\nUse this link to reset your Blossom Studio password. This link is valid for 15 minutes:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`
    });

    res.json({ message: "If this email is registered, a password reset link has been sent." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters.");
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error("Password reset link is invalid or expired.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can login with your new password." });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, profile, updateWishlist, forgotPassword, resetPassword };
