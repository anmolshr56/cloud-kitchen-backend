const express = require("express");
const router = express.Router();

const Menu = require("../models/Menu");
const auth = require("../middleware/authMiddleware");

/**
 * ADD MENU ITEM
 */
router.post("/add", auth, async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const menu = await Menu.create({
      name,
      price,
      category,
    });

    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL MENU
 */
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().populate("category", "name");
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
