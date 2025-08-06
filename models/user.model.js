const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// User Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  lastName: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: String,
    default: "active",
    enum: ["active", "suspended", "deleted", "closed"],
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.comparePassword = function (candidatePassword) {
  console.log("candidatePassword", candidatePassword);
  console.log("this.password", this.password);
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
