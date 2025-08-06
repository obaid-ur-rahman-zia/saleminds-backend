const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  apiUrl: {
    type: String,
    required: false,
  },
  primaryColor: {
    type: String,
    required: false,
  },
  secondaryColor: {
    type: String,
    required: false,
  },
  tertiaryColor: {
    type: String,
    require: false
  },
  tableHeaderColor: {
    type: String,
    require: false
  },
  storeName: {
    type: String,
    required: false,
  },
  storeURL:{
    type: String,
    required: false,
  },
  logo: {
    type: String,
    required: false,
  },
  fontFamily: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  facebookURL: {
    type: String,
    required: true,
  },
  linkedInURL: {
    type: String,
    required: true,
  },
  instagramURL: {
    type: String,
    required: true,
  },
  youtubeURL: {
    type: String,
    required: true,
  },
  googleMapURL: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  returnPolicy: {
    type: String,
  },
  shippingPolicy: {
    type: String,
  },
  privacyPolicy: {
    type: String,
  },
  rewardPolicy: {
    type: String,
  },
  shippers: {
    type: Array,
  },
  isDelivery: {
    type: Boolean,
    default: false,
  },
  isPickup: {
    type: Boolean,
    default: false,
  },
  googleBusinessAccount: {
    type: Object,
    require: false,
    default: {}
  }
});

module.exports = mongoose.model("settings", settingSchema);
