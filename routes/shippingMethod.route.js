const {
  getShippingMethods,
  getSingleShippingMethod,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
} = require("../controllers/shippingMethod.controller");

const express = require("express");
const router = express.Router();

router.get("/", getShippingMethods);

// Get a specific shipping method by ID
router.get("/:id", getSingleShippingMethod);

// Create a new shipping method
router.post("/", createShippingMethod);

// Update a shipping method by ID
router.put("/:id", updateShippingMethod);

// Delete a shipping method by ID
router.delete("/:id", deleteShippingMethod);

module.exports = router;
