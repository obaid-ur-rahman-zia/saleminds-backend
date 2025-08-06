const express = require("express");
const { createReport } = require("../controllers/bugreport.controller");

const router = express.Router();

router.post("/", createReport);

module.exports = router;
