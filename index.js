const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Cloud Kitchen Backend is LIVE 🚀");
});

// Auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection (SAFE VERSION)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });

// Server should ALWAYS run
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
