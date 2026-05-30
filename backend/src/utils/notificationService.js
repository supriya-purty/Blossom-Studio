const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const smtpTimeout = () => Number(process.env.SMTP_TIMEOUT_MS || 20000);

const formatMailError = (error) => {
  const message = error?.message || "Email could not be sent.";
  if (/timeout|timed out|greeting never received/i.test(message)) {
    return "Email server connection timed out. Check Gmail App Password, SMTP settings, and redeploy backend.";
  }
  if (/invalid login|authentication|username|password/i.test(message)) {
    return "Email login failed. Use a Gmail App Password, not your normal Gmail password.";
  }
  return message;
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    requireTLS: Number(process.env.SMTP_PORT || 587) === 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS.replace(/\s/g, "")
    },
    connectionTimeout: smtpTimeout(),
    greetingTimeout: smtpTimeout(),
    socketTimeout: smtpTimeout()
  });

const sendMail = async ({ to, subject, message, replyTo }) => {
  if (!hasSmtpConfig() || !to) return false;

  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo,
      subject,
      text: message
    });
  } catch (error) {
    throw new Error(formatMailError(error));
  }
  return true;
};

const notifyUserAndAdmin = async ({
  type,
  user,
  subject,
  message,
  adminMessage,
  userMessage,
  sendToUser = true,
  sendToAdmin = true
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || "blossomstudio.creations@gmail.com";
  const dbAvailable = mongoose.connection.readyState === 1;
  const notificationData = {
    type,
    user: user?._id,
    userEmail: user?.email,
    userPhone: user?.phoneNumber,
    adminEmail,
    subject,
    message
  };
  const notification = dbAvailable
    ? await Notification.create(notificationData)
    : {
        ...notificationData,
        emailSent: false,
        status: "queued",
        save: async () => {}
      };

  setImmediate(async () => {
    try {
      const userEmailSent = sendToUser
        ? await sendMail({ to: user?.email, subject, message: userMessage || message })
        : false;
      const adminEmailSent = sendToAdmin
        ? await sendMail({
            to: adminEmail,
            subject: `[Admin] ${subject}`,
            message: adminMessage || message,
            replyTo: user?.email
          })
        : false;

      notification.emailSent = userEmailSent || adminEmailSent;
      notification.status = notification.emailSent ? "sent" : "queued";
      await notification.save();
    } catch (error) {
      notification.status = "failed";
      notification.error = error.message;
      await notification.save();
    }
  });

  return notification;
};

module.exports = { notifyUserAndAdmin, sendMail, hasSmtpConfig };
