const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    isSingle: {
      type: Boolean,
    },
    validityDates: {
      type: Array,
    },
    discountType: {
      type: String,
    },
    discountAmount: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
    },
    isExpired: {
      type: Boolean,
    },
    selectedCustomers: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: false,
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
