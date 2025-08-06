const express = require("express");
const router = express.Router();

const {
  createAuthToken,
  verifyAddress,
  refreshToken,
  checkAuthTokenValid,
  getShippingMethods,
  createShippment,
} = require("../controllers/ups.controller");

router.get("/create-auth-token", createAuthToken);

router.post("/check-valid-auth-token", checkAuthTokenValid);

router.post("/verify-address", verifyAddress);

router.post("/rating-methods", getShippingMethods);

router.post("/create-shippment", createShippment);

module.exports = router;

// router.post("/refresh-auth-token", refreshToken);
