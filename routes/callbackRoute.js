const express = require("express");
const { fetchAllCallBackRequest, pushNewCallBackRequest } = require("../controllers/callback.controller");

const router = express.Router(); // Import your Mongoose model

router.post("/create", pushNewCallBackRequest)
router.get("/list", fetchAllCallBackRequest)

module.exports = router;
