const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

/**
 * PLACE ORDER (Customer)
 */
router.post("/place", async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const order = new Order({
      customerName,
      customerPhone,
      items,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL ORDERS (Admin / Super Admin)
 */
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "items.menuId",
      "name"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔥 UPDATE ORDER STATUS (Admin / Super Admin)
 */
router.put("/update/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order updated successfully",
      status: order.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
