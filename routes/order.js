const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

/* ================= PLACE ORDER (PUBLIC) ================= */
router.post("/place", async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      items,
    } = req.body;

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !items?.length
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const order = await Order.create({
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to place order" });
  }
});

/* ================= GET ALL ORDERS (ADMIN + SUPER_ADMIN) ================= */
router.get(
  "/",
  auth(["ADMIN", "SUPER_ADMIN"]),
  async (req, res) => {
    try {
      const orders = await Order.find().populate(
        "items.menuId",
        "name"
      );

      res.json({
        success: true,
        data: orders,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  }
);

/* ================= UPDATE ORDER STATUS (ADMIN + SUPER_ADMIN) ================= */
router.put(
  "/update/:id",
  auth(["ADMIN", "SUPER_ADMIN"]),
  async (req, res) => {
    try {
      const { status } = req.body;

      // ✅ STRICT status allowed (same as model)
      const allowedStatus = ["PENDING", "PREPARING", "DELIVERED"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      // ✅ LOCKED FLOW
      if (order.status === "DELIVERED") {
        return res.status(400).json({
          success: false,
          message: "Delivered order cannot be updated",
        });
      }

      if (
        order.status === "PENDING" &&
        status !== "PREPARING"
      ) {
        return res.status(400).json({
          success: false,
          message: "Order must be PREPARING first",
        });
      }

      if (
        order.status === "PREPARING" &&
        status !== "DELIVERED"
      ) {
        return res.status(400).json({
          success: false,
          message: "Order must be DELIVERED next",
        });
      }

      order.status = status;
      await order.save();

      res.json({
        success: true,
        message: "Order status updated",
        data: {
          orderId: order._id,
          status: order.status,
        },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
