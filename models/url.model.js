const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  oldUrl: {
    type: String,
    unique: true,
    required: true,
  },
  newUrl: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("url", urlSchema);
