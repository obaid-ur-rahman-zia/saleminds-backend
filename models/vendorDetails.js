const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorDetailsSchema = new Schema({
    vendorBusinessName: {
        type: String,
        required: true
    },
    vendorBusinessEmailAddress: {
        type: String,
        required: true
    },
    vendorBusinessPhone: {
        type: String,
        required: true
    },
    vendorBusinessCountry: {
        type: String,
        required: true
    },
    vendorBusinessZipCode: {
        type: String,
        required: true
    },
    vendorBusinessState: {
        type: String,
        required: true
    },
    vendorBusinessAddress: {
        type: String,
        required: true
    },
    vendorBusinessDomainURL: {
        type: String,
        required: true
    },
    vendorAdminID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("VendorDetails", vendorDetailsSchema);