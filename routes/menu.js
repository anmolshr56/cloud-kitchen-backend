const express = require("express");
const Menu = require("../models/Menu");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ADD MENU */
router.post("/add", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(201).json(menu);
});

/* UPDATE MENU */
router.put("/update/:id", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(updated);
});

/* DELETE MENU */
router.delete("/delete/:id", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ message: "Menu deleted" });
});

/* GET MENU (PUBLIC) */
router.get("/", async (req, res) => {
  const menu = await Menu.find({ isAvailable: true }).populate("category");
  res.json(menu);
});

module.exports = router;
