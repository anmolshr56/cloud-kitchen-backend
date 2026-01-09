const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ADD CATEGORY */
router.post("/add", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
});

/* GET CATEGORIES */
router.get("/", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

module.exports = router;
