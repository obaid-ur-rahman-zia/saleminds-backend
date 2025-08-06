const express = require("express");
const router = express.Router();
const {
  createProductOption,
  getAllProductOption,
  createProductOptionsBulk,
  deleteProductOption,
  editNameOfProductOption
} = require("../../controllers/product/productOption.controller");

router.post("/", createProductOption);

router.post("/bulk", createProductOptionsBulk);

router.get("/", getAllProductOption);

router.delete("/:id", deleteProductOption);

router.post("/edit/:id", editNameOfProductOption)


module.exports = router;
