const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// User Schema
const adminUser = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        // required: true,
    },
    telephone: {
        type: String,
        required: true
    },
    role: {
        type: String,
    },
    status: {
        type: String,
        enum: ["banned", "unbanned"],
        default: "banned",
    },
    image: {
        type: String,
        default: "public/uploads/admin/users/default_image.png"
    },
    resetPasswordToken: {
        type: String,
        default: undefined 
    },
    resetPasswordExpires: {
        type: Date,        
        default: undefined 
    }
});


adminUser.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "1d",
    });
    return token;
};

adminUser.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("adminUser", adminUser);
