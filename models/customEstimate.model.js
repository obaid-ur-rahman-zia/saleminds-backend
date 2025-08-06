const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customEstimateSchema = new Schema(
  {
    _id: {
      type: String,
      // default: generateOrderNumber(),
    },
    userId: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
    },
    category: {
      type: Object,
    },
    unitSetPrice: {
      type: Number,
      default: 0,
    },
    product: {
      type: Object,
    },
    productDetails: {
      type: Object,
    },
    agentComments: {
      type: String,
      default: "",
    },
    contactInfo: {
      type: Object,
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
    },
    additionalNotes: {
      type: String,
    },
    quantities: {
      type: Array,
    },
    knowsSpecifications: {
      type: Boolean,
      required: true,
    },
    wantsEconomicalOption: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "approved",
        "approved-partial",
        "declined-by-customer",
        "expired",
        "pending",
        "rejected-by-agent",
      ],
      default: "pending",
    },
  },
  { _id: false }
);

module.exports = mongoose.model("customEstimate", customEstimateSchema);
