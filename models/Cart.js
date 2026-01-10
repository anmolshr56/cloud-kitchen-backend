const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
