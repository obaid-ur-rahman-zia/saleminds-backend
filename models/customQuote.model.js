const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomQuotes = new Schema({
    id: {
        type: Number,
        required: false,
        unique: true,
        default: function () {
            return Math.floor(100000 + Math.random() * 900000);
        }
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    attachmentURL: {
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

module.exports = mongoose.model("CustomQuotes", CustomQuotes);
