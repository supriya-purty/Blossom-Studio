const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    paymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    paymentMethod: { type: String, default: "Razorpay" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["created", "captured", "failed"], default: "created" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
