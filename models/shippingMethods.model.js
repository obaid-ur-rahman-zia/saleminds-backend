const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productionFacility: {
    type: String,
    required: true,
  },
  shippingTimeDetail: {
    type: String,
    required: true,
  },
  shippingTime: {
    type: Number,
    required: true,
  },
  productionTime: {
    type: Number,
    required: Number,
  },
});

module.exports = mongoose.model("ShippingMethod", shippingMethodSchema);
