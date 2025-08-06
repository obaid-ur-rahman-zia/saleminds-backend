const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleBasedUser = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    routes: {
        type: Array,
        default: [],
    },
    whiteArea: {
        type: Array,
        default: [],
    },
});


module.exports = mongoose.model("roleBasedUser", roleBasedUser);
