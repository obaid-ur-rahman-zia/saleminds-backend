const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: "",
  },
  streetAddress: {
    type: String,
    required: true,
    // unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isDefaultBilling: {
    type: Boolean,
    default: false,
  },
  isDefaultShipping: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Address", addressSchema);
