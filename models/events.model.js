const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  emailAddress: {
    type: String,
  },
  companyName: {
    type: String,
  },
  companyWebsite: {
    type: String,
  },
  eventId: {
    type: String,
    ref: "customEvents",
  },
});

module.exports = mongoose.model("events", eventsSchema);
