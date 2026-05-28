const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminEmail: String,
    userEmail: String,
    userPhone: String,
    subject: String,
    message: String,
    emailSent: { type: Boolean, default: false },
    phoneSent: { type: Boolean, default: false },
    status: { type: String, enum: ["queued", "sent", "failed"], default: "queued" },
    error: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
