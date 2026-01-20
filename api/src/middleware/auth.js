const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../configuration");

function auth(req, res, next) {
  const header = req.headers.authorization;

  console.log("🔐 Auth middleware:");
  console.log("  Header:", header ? "✅" : "❌");

  if (!header) {
    console.log("  ❌ No Authorization header");
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];
  
  if (!token) {
    console.log("  ❌ Token not found after 'Bearer'");
    return res.status(401).json({ message: "Invalid token" });
  }

  console.log("  Token:", token.substring(0, 20) + "...");
  console.log("  Secret used:", jwtSecret.substring(0, 20) + "...");

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("  ✅ Token verified, user ID:", decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("  ❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
