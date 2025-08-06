const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsletterSubscribedUsers = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  datetime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("newsletterSubscribedUsers", newsletterSubscribedUsers);
