const express = require("express");
const router = express.Router();

const Menu = require("../models/Menu");
const auth = require("../middleware/auth");

// 🔹 ADD MENU ITEM (SUPER_ADMIN only)
router.post("/add", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, price, category } = req.body;

    const menu = new Menu({
      name,
      price,
      category
    });

    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 GET ALL MENU ITEMS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().populate("category", "name");
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 UPDATE MENU ITEM (SUPER_ADMIN)
router.put("/update/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
