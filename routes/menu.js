const express = require("express");
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * ADD MENU ITEM (SUPER_ADMIN only)
 * POST /api/menu/add
 */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, price, category, isAvailable } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const menu = await Menu.create({
      name,
      price,
      category,
      isAvailable,
    });

    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL MENU ITEMS
 * GET /api/menu
 */
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().populate("category");
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE MENU
 * PUT /api/menu/update/:id
 */
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
