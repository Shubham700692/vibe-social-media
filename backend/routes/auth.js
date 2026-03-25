const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper — generate a signed JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
// router.post("/signup", async (req, res) => {
//     console.log("🔥 Signup route hit");
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     console.log("✅ USER CREATED:", user);
//     const exists = await User.findOne({ $or: [{ email }, { username }] });
//     if (exists) {
//       const field = exists.email === email ? "Email" : "Username";

//       return res.status(409).json({ message: `${field} is already taken` });
//     }

//     const user = await User.create({ username, email, password });

//     res.status(201).json({
//       token: generateToken(user._id),
//       user: {
//         _id:      user._id,
//         username: user.username,
//         email:    user.email,
//       },
//     });
//   } catch (err) {
//      console.error("SIGNUP ERROR FULL:", err);
//     res.status(500).json({ message: err.message });
//   }
// });
router.post("/signup", async (req, res) => {
  console.log("🔥 Signup route hit");

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ check existing user
    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      const field = exists.email === email ? "Email" : "Username"; // ✅ FIXED
      return res.status(409).json({ message: `${field} is already taken` });
    }

    // ✅ create user AFTER check
    const user = await User.create({ username, email, password });

    console.log("✅ USER CREATED:", user);

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("❌ SIGNUP ERROR FULL:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id:      user._id,
        username: user.username,
        email:    user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me — get current logged-in user
router.get("/me", protect, (req, res) => {
  res.json({
    _id:      req.user._id,
    username: req.user.username,
    email:    req.user.email,
  });
});

module.exports = router;