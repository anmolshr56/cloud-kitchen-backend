const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");

/**
 * ADD CATEGORY (SUPER ADMIN)
 */
router.post("/add", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name required" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL CATEGORIES
 */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
