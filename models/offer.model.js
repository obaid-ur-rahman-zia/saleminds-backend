const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Offer", offerSchema);
