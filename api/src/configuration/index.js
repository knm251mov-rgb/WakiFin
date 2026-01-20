require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || "0.0.0.0",
  mongoURL: process.env.MONGO_URL || "mongodb://localhost:27017/wakifin",
  jwtSecret: process.env.JWT_SECRET || "MY_SECRET_TOKEN"
};
