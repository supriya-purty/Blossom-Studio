const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const contactRoutes = require("./routes/contactRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { requireDB } = require("./middleware/dbMiddleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Blossom Studio API",
    database: req.app.locals.dbConnected ? "connected" : "disconnected"
  });
});

app.use("/api/auth", requireDB, authRoutes);
app.use("/api/products", requireDB, productRoutes);
app.use("/api/categories", requireDB, categoryRoutes);
app.use("/api/cart", requireDB, cartRoutes);
app.use("/api/orders", requireDB, orderRoutes);
app.use("/api/payments", requireDB, paymentRoutes);
app.use("/api/admin", requireDB, adminRoutes);
app.use("/api/newsletter", requireDB, newsletterRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
