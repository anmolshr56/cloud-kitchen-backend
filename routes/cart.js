const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const auth = require("../middleware/authMiddleware");

/**
 * ADD / UPDATE CART
 */
router.post("/", auth(["USER"]), async (req, res) => {
  const { items } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items
    });
  } else {
    cart.items = items;
    await cart.save();
  }

  res.json(cart);
});

/**
 * GET CART
 */
router.get("/", auth(["USER"]), async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  res.json(cart || { items: [] });
});

/**
 * CLEAR CART
 */
router.delete("/", auth(["USER"]), async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });
  res.json({ message: "Cart cleared" });
});

module.exports = router;
