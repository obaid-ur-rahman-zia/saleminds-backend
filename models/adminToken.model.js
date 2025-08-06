const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminTokenSchema = new Schema({
  adminUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "adminUser",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model("adminToken", adminTokenSchema);
