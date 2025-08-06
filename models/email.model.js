const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    receiver:{
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sendingStatus:{
        type: Boolean,
        required: true,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required:false
    },
});

module.exports = mongoose.model("email", emailSchema);