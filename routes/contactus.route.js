const express = require("express");
const { createContactUs, getContactUs, deleteContactUsRecord } = require("../controllers/contactus.controller");

const router = express.Router(); // Import your Mongoose model

router.get("/", getContactUs);

router.post("/", createContactUs);

router.delete("/delete/", deleteContactUsRecord);

module.exports = router;
