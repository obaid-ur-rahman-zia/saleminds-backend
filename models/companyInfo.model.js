const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companyInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  DBA: {
    type: String,
  },
  businessType: {
    type: String,
    required: true,
  },
  resellerId: {
    type: String,
  },
});

module.exports = mongoose.model("CompanyInfo", companyInfoSchema);