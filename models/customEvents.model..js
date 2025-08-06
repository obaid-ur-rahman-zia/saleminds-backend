const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customEventSchema = new Schema({
    eventName: {
        type: String,
        required: true
    },
    eventPathName: {
        type: String,
        required: true,
        unique: true
    },
    eventLogo: {
        type: String
    },
    eventDate: {
        type: Date
    },
    eventDescription: {
        type: String
    },
    eventTelephone:{
        type: String
    },
    eventEmail:{
        type: String
    },
    eventAddress: {
        type: String
    },
    organizerTagLine:{
        type: String,
    },
    eventPromotionDiscount:{
        type:String,
    },
    tagLineAboutPromotion: {
        type: String
    },
    backgroundImage: {
        type: String
    },
    status: {
        type: Boolean,
        default: false,
        required: false
    }
});

module.exports = mongoose.model("customEvents", customEventSchema);
