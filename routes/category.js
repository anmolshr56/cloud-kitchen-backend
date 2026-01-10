const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= ADD CATEGORY (ADMIN) ================= */
router.post("/add", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add category" });
  }
});

/* ================= GET CATEGORIES (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;
