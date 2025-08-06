const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productWeightCategory = new Schema({
  name: {
    type: String,
    required: true,
  },
  gsm: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("productWeightCategory", productWeightCategory);
