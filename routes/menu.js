const express = require("express");
const Menu = require("../models/Menu");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= ADD MENU ================= */
router.post("/add", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
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

/* ================= UPDATE MENU ================= */
router.put("/update/:id", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE MENU ================= */
router.delete("/delete/:id", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= TOGGLE AVAILABILITY ================= */
router.put(
  "/availability/:id",
  auth(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    try {
      const menu = await Menu.findById(req.params.id);

      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }

      menu.isAvailable = !menu.isAvailable;
      await menu.save();

      res.json({
        message: "Availability updated",
        isAvailable: menu.isAvailable,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= GET MENU (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find({ isAvailable: true }).populate("category");
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET ALL MENU (ADMIN) ================= */
router.get(
  "/all",
  auth(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    try {
      const menu = await Menu.find().populate("category");
      res.json(menu);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
