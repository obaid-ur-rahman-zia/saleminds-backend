const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
  question: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    ref: "Category",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
    required: false,
  },
});

module.exports = mongoose.model("query", QuerySchema);
