const express = require("express");
const router = express.Router();

const {
  getAllAddressOfUser,
  createNewAddress,
  updateAddress,
  deleteAddress,
  getDefaultBilling,
  getDefaultShipping,
} = require("../controllers/address.controller");

// Get all addresses for a specific user
router.get("/user/:userId", getAllAddressOfUser);

// Create a new address
router.post("/:userId", createNewAddress);

// Update an existing address
router.patch("/:id", updateAddress);

// Delete an address
router.delete("/:id", deleteAddress);

router.get("/user/:userId/default-billing", getDefaultBilling);

// Get default shipping address for a user
router.get("/user/:userId/default-shipping", getDefaultShipping);

module.exports = router;
