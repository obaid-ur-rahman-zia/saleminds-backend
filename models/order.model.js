const mongoose = require("mongoose");
const shortid = require("shortid");
// const { generateOrderNumber } = require("../utils/helpers");
const Schema = mongoose.Schema;

const SetSchema = new mongoose.Schema(
  {
    status: { type: mongoose.Schema.Types.ObjectId, ref: "OrderStatus" },
    artwork: {
      type: Array,
    },
    jobId: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  { _id: false }
);

const ShipmentSchema = new mongoose.Schema(
  {
    sets: [SetSchema],
    dropShipAddress: {
      type: Object,
    },
    shippingAddress: {
      type: Object,
    },
    upsAddress: {
      type: Object,
    },
    shippingMethod: {
      type: Object,
    },
    shippingDetail: {
      type: Object,
    },
    isDropShip: {
      type: Boolean,
    },
    shippingDates: {
      type: Object,
    },
    shippingType: {
      type: String,
      enum: ["pickup", "delivery"],
    },
    pickupAddress: {
      type: Object,
    },
    // other fields
  },
  { _id: false }
);

const ShippingSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    shipments: [ShipmentSchema],
    setPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    productWeight: {
      type: Number,
    },
    handlingFee: {
      type: Number,
    },
    taxPrice: {
      type: Number,
    },
    totalSets: {
      type: Number,
    },
    uploadArtworkLater: {
      type: Boolean,
    },

    // other fields
  },
  { _id: false }
);

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, ref: "Product" },
    categoryId: { type: String, ref: "Category" },
    productName: { type: String },
    product: {
      type: Object,
    },
    additionalPrices: {
      type: Object,
    },
    shipping: ShippingSchema,
    total: {
      type: Number,
    },
    isSelected: {
      type: Boolean,
    },
    productSKU: {
      type: String,
    },
    // other fields
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    _id: {
      type: String,
      // default: generateOrderNumber(),
    },
    cartItems: [CartItemSchema],
    // cartItems: {
    //   type: Array,
    // },
    invoiceNo: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    paymentDetails: {
      type: Object,
    },
    status: {
      type: String,
      ref: "OrderStatus",
    },
    coupon: {
      type: Object,
    },
    rewardPoints: {
      type: Object,
    },
    cartTotal: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
    orderDate: {
      type: String,
    },
    trackingNumber: {
      type: String,
      required: false,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdOn: {
      type: Date,
      default: Date.now,
      required: false,
    },
  },
  { _id: false }
);

module.exports = mongoose.model("Order", orderSchema);
