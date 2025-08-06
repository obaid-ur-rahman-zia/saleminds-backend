const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productReview = new Schema({
  productId: {
    type: String,
    ref: "Product",
  },
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
  },
  reviewDate: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("ProductReview", productReview);
