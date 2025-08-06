const crypto = require("crypto");
const Order = require("../models/order.model");
const customEstimateModel = require("../models/customEstimate.model");

function getFirstSixCharacters(number) {
  // Convert the number to a string
  const numberStr = number.toString();
  // Get the first 6 characters
  const firstSix = numberStr.substring(0, 6);
  return firstSix;
}

function formatPrice(price) {
  console.log("price", price);
  if (price > 1000) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return price.toFixed(2);
  }
}
async function generateOrderNumber() {
  try {
    const latestOrder = await Order.find({}, {}, { sort: { _id: -1 } }); // Find the document with the highest _id
    let nextOrderId = 1; // Default to 1 if no orders are found in the database
    if (latestOrder) {
      nextOrderId = parseInt(latestOrder._id, 10) + 1; // Increment the highest _id
    }
    return nextOrderId.toString().padStart(10, "0"); // Assign the _id with leading zeros
  } catch (error) {
    console.log("error", error);
  }
}

async function generateCustomEstimateId() {
  try {
    const latestEstimate = await customEstimateModel.countDocuments();
    let nextEstimateId = latestEstimate + 1; // Default to 1 if no orders are found in the database

    return "E" + String(nextEstimateId).padStart(10, "0"); // Assign the _id with leading zeros
  } catch (error) {
    console.log("error", error);
  }
}

const upsServiceCodes = {
  "01": "UPS Next Day Air/UPS Express",
  "02": "UPS 2nd Day Air/UPS Expedited",
  "03": "UPS Ground",
  "07": "UPS Worldwide Expedited/UPS Expedited",
  11: "UPS Worldwide Standard/UPS Standard",
  12: "UPS 3 Day Select",
  13: "UPS Next Day Air Saver/UPS Express Saver (to US)",
};

module.exports = {
  generateOrderNumber,
  formatPrice,
  upsServiceCodes,
  getFirstSixCharacters,
  generateCustomEstimateId,
};
