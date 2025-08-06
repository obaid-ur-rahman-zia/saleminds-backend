const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callBackModel = new Schema({
    type:{
        type: String,
        required: true,
        enum: ['insta-status', 'callback']
    },
    customerName:{
        type: String,
        required: true
    },
    customerEmailAddress:{
        type: String,
        required: true
    },
    callBackPhoneNumber:{
        type: String,
        required: true
    },
    orderId:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
        enum: ['status-callback', 'general-info','shipping','product-info','estimating','accounting']
    },
    requestedInfo:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("callBackRequests", callBackModel);
