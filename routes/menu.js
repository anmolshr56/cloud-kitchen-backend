const express = require("express");
const router = express.Router();

const Menu = require("../models/Menu");
const auth = require("../middleware/authMiddleware");

// ✅ ADD MENU ITEM (SUPER ADMIN)
router.post("/add", auth, async (req, res) => {
  try {
    const { name, price, category } = req.body;

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

// ✅ GET ALL MENU (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().populate("category", "name");
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE MENU
router.put("/update/:id", auth, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE MENU
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
