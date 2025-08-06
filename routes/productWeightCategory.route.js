const express = require("express");
const { createWeightCategories, deleteWeightCategories, getAllWeightCategories, updateWeightCategories } = require("../controllers/productWeightCategory.controller")

const check_auth = require("../middlewares/check_auth")

const router = express.Router();

router.get("/", getAllWeightCategories)

router.post("/create/", check_auth, createWeightCategories)

router.put("/update/:id", check_auth, updateWeightCategories)

router.delete("/delete/:id", check_auth, deleteWeightCategories)

module.exports = router;