// routes/productOptionValueRoutes.js
const express = require("express");
const {
  createProductOptionValue,
  getAllProductOptionValues,
  createProductOptionValuesBulk,
  deleteProductOptionValue,
  editNameOfProductOptionValue
} = require("../../controllers/product/productOptionValue.controller");
const router = express.Router();

// Route to create a new product option value
router.post("/", createProductOptionValue);

router.post("/bulk", createProductOptionValuesBulk);

// Route to get all product option values
router.get("/", getAllProductOptionValues);

// Route to delete a product option value
router.delete("/:id", deleteProductOptionValue);

router.post("/edit/:id", editNameOfProductOptionValue)

module.exports = router;
