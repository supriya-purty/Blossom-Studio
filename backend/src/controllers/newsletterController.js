const Newsletter = require("../models/Newsletter");

const subscribe = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.create({ email: req.body.email });
    res.status(201).json({ message: "Subscribed successfully", subscriber });
  } catch (error) {
    if (error.code === 11000) {
      res.status(200).json({ message: "You are already subscribed" });
      return;
    }
    next(error);
  }
};

module.exports = { subscribe };
