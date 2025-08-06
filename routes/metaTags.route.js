const express = require("express");
const {
  createNewMetaTag,
  deleteMetaTag,
  listAllMetaTag,
  updateMetaTag,
  getDetailById,
} = require("../controllers/metaTags.controller");
const check_auth = require("../middlewares/check_auth");
const router = express.Router(); // Import your Mongoose model

router.get("/list", listAllMetaTag);

router.delete("/delete/:id", check_auth, deleteMetaTag);

router.post("/add", check_auth, createNewMetaTag);

router.post("/update/:id", check_auth, updateMetaTag);

router.get("/detail/:id", check_auth, getDetailById);

module.exports = router;
