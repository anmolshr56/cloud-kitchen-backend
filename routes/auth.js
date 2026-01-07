const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// 🔒 ONE-TIME SUPER_ADMIN SEED
router.post("/seed-super-admin", async (req, res) => {
  const exists = await User.findOne({ role: "SUPER_ADMIN" });
  if (exists) return res.status(400).json({ message: "SUPER_ADMIN already exists" });

  const hash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
  const user = await User.create({
    name: "Super Admin",
    email: process.env.SUPER_ADMIN_EMAIL,
    password: hash,
    role: "SUPER_ADMIN"
  });

  res.json({ message: "SUPER_ADMIN created", id: user._id });
});

// ADMIN REGISTER (only SUPER_ADMIN)
router.post("/register-admin", auth(["SUPER_ADMIN"]), async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "ADMIN" });
  res.json({ message: "ADMIN created", id: user._id });
});

// LOGIN (ALL)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role });
});

module.exports = router;
