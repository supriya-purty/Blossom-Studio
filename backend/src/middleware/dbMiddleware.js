const mongoose = require("mongoose");

const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "MongoDB is disconnected. Use a stable Atlas connection or set MONGO_URI to local MongoDB for demo."
    });
  }

  return next();
};

module.exports = { requireDB };
