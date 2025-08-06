const express = require("express");
const router = express.Router();
const {
  createNewUrl,
  deleteUrl,
  updateUrl,
  getAllUrls,
  listAllUrls,
  getDetailOfUrlById,
  updateUrlStatus,
} = require("../controllers/url.controller");
const check_auth = require("../middlewares/check_auth");

// Create a new URL Redirection
router.post("/add", check_auth, createNewUrl);

router.get("/list", getAllUrls);

router.get("/list/all", listAllUrls);

// Get Detail of Url Redirection
router.get("/detail/:id", getDetailOfUrlById);

// Delete a url redirection
router.delete("/delete/:id", check_auth, deleteUrl);

// Update a url redirection
router.post("/update/:id", check_auth, updateUrl);

// update Live Status
router.post("/status/update/:id", check_auth, updateUrlStatus);

module.exports = router;
