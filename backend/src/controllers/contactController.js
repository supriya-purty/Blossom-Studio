const { notifyUserAndAdmin } = require("../utils/notificationService");

const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error("Please fill name, email, subject and message.");
    }

    const notification = await notifyUserAndAdmin({
      type: "contact_message",
      user: {
        name: name.trim(),
        email: email.trim().toLowerCase()
      },
      subject: `Contact message: ${subject.trim()}`,
      message: `${name.trim()} sent a contact message.\n\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}`,
      sendToUser: false,
      sendToAdmin: true
    });

    const sentText =
      notification.status === "sent"
        ? "Your message was sent to Blossom Studio."
        : "Your message was saved. Email is queued until SMTP is available.";

    res.status(201).json({ message: sentText, notification });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendContactMessage };
