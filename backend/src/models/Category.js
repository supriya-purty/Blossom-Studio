const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    apiCategory: { type: String, required: true, trim: true, unique: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
