const User = require("../models/User");
const generateToken = require("../utils/generateToken");

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

module.exports = { register, login, profile, updateWishlist };
