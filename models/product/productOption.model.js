const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOptionSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model("ProductOption", productOptionSchema);
