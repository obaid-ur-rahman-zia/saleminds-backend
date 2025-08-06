const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const groupCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  tagLine:{
    type: String,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      default: [],
    },
  ],
});

module.exports = mongoose.model("GroupCategory", groupCategorySchema);
