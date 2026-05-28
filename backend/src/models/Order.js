const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
    paymentMethod: {
      type: String,
      enum: ["Card", "UPI", "Cash on Delivery", "Razorpay"],
      default: "Cash on Delivery"
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed"
    },
    shippingAddress: {
      name: String,
      phoneNumber: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
