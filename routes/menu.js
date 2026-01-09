const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

// UPDATE MENU (ADMIN)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json({
      message: "Menu updated successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
