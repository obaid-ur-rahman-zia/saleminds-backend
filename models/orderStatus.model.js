const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderStatusSchema = new Schema({

    statusType: {
        type: String,
        required: true,
        enum: ['orderStatus', 'orderProductStatus']
    },

    setAs: {
        type: String,
        required: true,
        enum: ['normal', 'completed','cancelled','shipped']
    },

    statusTitle: {
        type: String,
        required: true
    },

    colorClass: {
        type: String,
        required: true
    },

    useOnJobBoard: {
        type: Boolean,
        required: false
    },

    internalStatus: {
        type: Boolean,
        required: false
    },

    allowCancellation: {
        type: Boolean,
        required: false
    },

    allowInvoiceDownload: {
        type: Boolean,
        required: false
    },

    status: {
        type: Boolean,
        required: false
    },

    notifyCustomer: {
        type: Boolean,
        required: false
    },

    notifyAdmin: {
        type: Boolean,
        required: false
    },

    isDefault : {
        type: Boolean,
        required: false
    }

})

module.exports = mongoose.model("OrderStatus", orderStatusSchema);