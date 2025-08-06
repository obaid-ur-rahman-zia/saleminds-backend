const express = require("express");
const {
  login,
  signup,
  verifyToken,
  resetPassword,
  verifyResetPasswordToken,
  createNewPassword,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", login);

router.post("/register", signup);

router.post("/reset-password", resetPassword);

router.post("/reset-token-verify", verifyResetPasswordToken);

router.post("/create-new-password", createNewPassword);

router.get("/:id/verify/:token/", verifyToken);

module.exports = router;
