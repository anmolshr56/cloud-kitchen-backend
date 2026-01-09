const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

/**
 * PLACE ORDER (PUBLIC)
 */
router.post("/place", async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;

    if (!customerName || !customerPhone || !items?.length) {
      return res.status(400).json({ message: "All fields required" });
    }

    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    const order = await Order.create({
      customerName,
      customerPhone,
      items,
      totalAmount
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL ORDERS (ADMIN + SUPER_ADMIN)
 */
router.get(
  "/",
  auth(["ADMIN", "SUPER_ADMIN"]),
  async (req, res) => {
    const orders = await Order.find().populate(
      "items.menuId",
      "name"
    );
    res.json(orders);
  }
);

/**
 * UPDATE ORDER STATUS (ADMIN + SUPER_ADMIN)
 */
router.put(
  "/update/:id",
  auth(["ADMIN", "SUPER_ADMIN"]),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatus = [
        "PENDING",
        "ACCEPTED",
        "PREPARING",
        "DELIVERED",
        "CANCELLED"
      ];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid order status" });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = status;
      await order.save();

      res.json({
        message: "Order updated successfully",
        orderId: order._id,
        status: order.status
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
