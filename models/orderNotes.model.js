const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderNotesSchema = new Schema({
  type: {
    type: String,
    enum: ["Generic", "Prepress", "Graphics", "Shipping", "Invoice"],
    default: "Generic",
  },
  noteFor: {
    type: String,
    enum: ["Order Product", "Order"],
    default: "Order Product",
  },
  uploadURL: {
    type: String,
  },
  comment: {
    type: String,
  },
  notifyCustomer: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: String,
    ref: "Order",
  },
  authorName: {
    type: String,
    required: false,
  },
  authorEmail: {
    type: String,
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

module.exports = mongoose.model("OrderNotes", orderNotesSchema);
