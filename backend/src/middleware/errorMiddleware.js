const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoNetworkError" ||
    err.message?.includes("ECONNREFUSED") ||
    err.message?.includes("querySrv")
  ) {
    return res.status(503).json({
      message: "Database is currently disconnected. Check MongoDB Atlas network access, internet, or use a local MongoDB URI."
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };
