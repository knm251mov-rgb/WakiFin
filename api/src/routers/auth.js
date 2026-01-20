const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtSecret } = require("../configuration");

const router = express.Router();

/* ----------------------------- REGISTER ----------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/* ------------------------------- LOGIN ------------------------------ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      console.log("❌ Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user._id);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "24h" }
    );

    console.log("✅ Token generated:", token.substring(0, 30) + "...");

    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (e) {
    console.error("❌ Login error:", e.message);
    res.status(400).json({ message: e.message });
  }
});


/* -------------------------- EMAIL VERIFY ---------------------------- */
// ВИДАЛЕНО: Роут /verify/:token більше не потрібен

module.exports = router;