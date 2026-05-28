const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB().then((dbConnected) => {
  app.locals.dbConnected = dbConnected;
  app.listen(PORT, () => {
    console.log(`Blossom Studio API running on port ${PORT}`);
    if (!dbConnected) {
      console.log("Database status: disconnected. Frontend can open, but login/orders/admin DB data need MongoDB.");
    }
  });
});
