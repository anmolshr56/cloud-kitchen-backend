const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Cloud Kitchen Backend is LIVE 🚀");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });

// Server ALWAYS runs
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
