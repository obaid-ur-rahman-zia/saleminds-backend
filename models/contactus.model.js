const mongoose = require("mongoose");

const ContactUsSchema = mongoose.Schema({
  name: String,
  email: String,
  message: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contactus", ContactUsSchema);
