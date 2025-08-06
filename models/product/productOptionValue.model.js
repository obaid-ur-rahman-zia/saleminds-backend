const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOptionValueSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("ProductOptionValue", productOptionValueSchema);
