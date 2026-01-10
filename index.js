const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Existing routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");

// ✅ NEW USER SIDE ROUTES
const userAuthRoutes = require("./routes/authUser");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Cloud Kitchen Backend is LIVE 🚀");
});

// ================= ROUTES =================

// Admin / Super Admin
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);

// ✅ Customer (USER)
app.use("/api/user", userAuthRoutes);
app.use("/api/cart", cartRoutes);

// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
