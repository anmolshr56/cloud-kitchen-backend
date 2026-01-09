const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =======================
   LOGIN (SUPER_ADMIN + ADMIN)
======================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    role: user.role
  });
});

/* =======================
   CREATE ADMIN (SUPER_ADMIN ONLY)
======================= */
router.post(
  "/create-admin",
  auth(["SUPER_ADMIN"]),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await User.create({
        email,
        password: hashedPassword,
        role: "ADMIN"
      });

      res.status(201).json({
        message: "ADMIN created successfully",
        adminId: admin._id
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
