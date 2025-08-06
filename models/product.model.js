const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skuSchema = new mongoose.Schema(
  {
    sizeId: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  { _id: false }
);


// Product Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
    default: [],
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isService: {
    type: Boolean,
    default: false,
  },
  setupPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  quantity: {
    type: Number,
  },
  addedBy: {
    type: String,
    ref: "adminUser",
    required: true,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  category: [
    {
      type: String,
      ref: "Category",
      required: true,
    },
  ],
  priceCategory: {
    type: String,
    required: true,
  },
  designer: {
    type: Object,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  additionalAttachments: {
    type: Object,
    default: {},
    required: false,
  },
  discount: {
    type: Object,
    default: {},
    required: false,
  },
  additionalPrices: {
    type: Array,
    default: [],
    require: false,
  },
  cutOffTime: {
    type: Number,
    default: 0,
    required: false,
  },
  productionDays: {
    type: Number,
    default: 0,
    required: false,
  },
  handlingFee: {
    type: Number,
    default: 0,
    required: false,
  },
  upsPackagingType: {
    type: String,
    required: false,
    default: "00",
  },
  productWeightCategory: {
    type: String,
    ref: "productWeightCategory",
    required: true,
  },
  rules: {
    type: Array,
    default: [],
  },
  tax_vat: {
    type: String,
    default: '0'
  },
  skus: [skuSchema],
  isPickup: {
    type: Boolean,
    default: false,
  },
  isDelivery: {
    type: Boolean,
    default: false,
  },
  allowRequestAQuote: {
    type: Boolean,
    default: false,
  },
  allowForegroundColorSelector: {
    type: Boolean,
    default: false,
  },
  allowBackgroundColorSelector: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Product", productSchema);
