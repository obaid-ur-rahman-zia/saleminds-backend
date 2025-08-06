const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
router.post("/sign-cart-items", async (req, res, next) => {
  const { cartItems } = req.body;

  console.log("req.user", req.user);

  const user = await userModel.findById(req.user._id);

  if (user?.isAdmin === undefined || user.isAdmin === false) {
    return res.status(400).json({ message: "UnAuthorized" });
  }

  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ message: "Invalid cartItems" });
  }

  try {
    const token = jwt.sign({ cartItems }, process.env.JWTPRIVATEKEY, { expiresIn: "2d" });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Error signing cart items", error });
  }
});

// API to decode cart items
router.post("/decode-cart-items", async (req, res, next) => {
  const { token } = req.body;

  //   const user = await userModel.findById(req.user._id);

  //   if (user?.isAdmin === undefined || user.isAdmin === false) {
  //     return res.status(400).json({ message: "UnAuthorized" });
  //   }
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    return res.json({ cartItems: decoded.cartItems });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token", error });
  }
});
module.exports = router;
