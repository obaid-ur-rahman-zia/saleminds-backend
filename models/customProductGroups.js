const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomProductGroups = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  isBestSerice: {
    type: Boolean,
    default: false,
  },
  products: [
    {
      type: String,
      ref: "Product",
      required: true,
    },
  ],
});

module.exports = mongoose.model("CustomProductGroups", CustomProductGroups);
