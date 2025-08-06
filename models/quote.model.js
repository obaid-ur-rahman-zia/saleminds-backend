const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    id: {
        type: Number,
        required: false,
        unique: true,
        default: function () {
            return Math.floor(100000 + Math.random() * 900000);
        }
    },
    title: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    product: {
        type: Object,
    },
    additionalDetails: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "pending",
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    comments: {
        type: String,
        default: "",
    }
});

module.exports = mongoose.model("quote", QuoteSchema);
