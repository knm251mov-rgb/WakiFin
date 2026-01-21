const jwt = require("jsonwebtoken");

const JWT_SECRET = "MY_SECRET_TOKEN"; // ⚠️ ТАКИЙ ЖЕ як в auth.js!

function auth(req, res, next) {
  const header = req.headers.authorization;

  console.log("🔐 Auth check - Authorization header:", header ? "✅" : "❌");

  if (!header) {
    console.log("  ❌ Missing Authorization header");
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    console.log("  ❌ Token not found after 'Bearer'");
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("  ✅ Token verified for user:", decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("  ❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
