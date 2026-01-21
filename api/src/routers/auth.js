const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = "MY_SECRET_TOKEN"; // ⚠️ ВАЖЛИВО: такий же як в middleware!

/* ✅ REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();
    console.log("✅ User registered:", email);
    res.status(201).json({ message: "User created" });
  } catch (e) {
    console.error("❌ Register error:", e.message);
    res.status(400).json({ message: e.message });
  }
});

/* ✅ LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      console.log("❌ Wrong password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User authenticated:", user._id);

    // ✅ Генеруємо JWT токен
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Token generated for:", email);

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

module.exports = router;