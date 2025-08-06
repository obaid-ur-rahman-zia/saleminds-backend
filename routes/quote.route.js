const express = require("express");
const router = express.Router();

const { createQuote, getAllQuotes, updateQuoteByID, getQuoteByID, deleteQuoteByID, createNewCustomQuote, fetchAllCustomQuotes, fetchDetailOfCustomQuote, deleteCustomQuoteByID } = require("../controllers/quote.controller");
const check_auth = require("../middlewares/check_auth");

router.get("/", getAllQuotes);

router.post("/new/", createQuote)

router.post("/update/",check_auth, updateQuoteByID);

router.get("/view/:quoteId", getQuoteByID);

router.post("/delete/",check_auth, deleteQuoteByID);

router.post("/custom/new", createNewCustomQuote)

router.get("/custom/listing", check_auth, fetchAllCustomQuotes);

router.get("/custom/detail/:id", check_auth, fetchDetailOfCustomQuote);

router.delete("/custom/delete/:id", check_auth, deleteCustomQuoteByID);

module.exports = router;