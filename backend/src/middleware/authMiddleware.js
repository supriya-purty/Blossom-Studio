const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    return next();
  } catch (error) {
    res.status(401);
    return next(new Error("Not authorized, token invalid"));
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403);
  return next(new Error("Admin access required"));
};

module.exports = { protect, adminOnly };
