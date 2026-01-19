const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Використовуватиме оновлену модель
const router = new express.Router();
const crypto = require("crypto"); // Більше не потрібен, але залишимо для прикладу
// const crypto = require("crypto"); // <-- Ця лінія тепер зайва

const SECRET = "MY_SECRET_TOKEN";

/* ----------------------------- REGISTER ----------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    // Поля verifyToken та isVerified більше не додаються до користувача
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.json({
      message: "Registered! You can now log in.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        // Інші поля, окрім password
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ------------------------------- LOGIN ------------------------------ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing fields",
        details: {
          email: email ? "OK" : "Email is missing",
          password: password ? "OK" : "Password is missing",
        }
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        details: { email: "No account exists with this email" }
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Incorrect password",
        details: {
          expected: "Correct password",
          received: password
        }
      });
    }

    // ВИДАЛЕНО: Перевірку if (!user.isVerified) більше не виконуємо.
    // Користувач входить, якщо email та пароль правильні.

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Logged in", token, user });

  } catch (err) {
    res.status(400).json({
      message: "Server exception",
      details: err.message,
      stack: err.stack,
    });
  }
});


/* -------------------------- EMAIL VERIFY ---------------------------- */
// ВИДАЛЕНО: Роут /verify/:token більше не потрібен

module.exports = router;