const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BugReport = new Schema({
  message: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("bugreport", BugReport);
