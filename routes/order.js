const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   PLACE ORDER (PUBLIC)
========================= */
router.post("/place", async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;

    if (!customerName || !customerPhone || !items?.length) {
      return res.status(400).json({ message: "All fields required" });
    }

    let total = 0;
    items.forEach(i => {
      total += i.price * i.quantity;
    });

    const order = await Order.create({
      customerName,
      customerPhone,
      items,
      totalAmount: total
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
router.get("/", auth(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
  const orders = await Order.find().populate("items.menuId", "name");
  res.json(orders);
});

/* =========================
   UPDATE ORDER STATUS
========================= */
router.put(
  "/update-status/:id",
  auth(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  }
);

module.exports = router;
