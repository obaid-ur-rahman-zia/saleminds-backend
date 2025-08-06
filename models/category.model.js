const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },

  bannerImage: {
    type: String,
  },

  pictures: {
    type: [String],
  },

  allowedOptions: [
    {
      type: String,
      ref: "ProductOption",
    }
  ]

});

module.exports = mongoose.model("Category", categorySchema);
