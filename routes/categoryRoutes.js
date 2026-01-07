const express = require("express");
const router = express.Router();
const { createCategory } = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/add", protect, adminOnly, createCategory);

module.exports = router;
