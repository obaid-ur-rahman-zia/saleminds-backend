const express = require("express");
const {
  getVouchers,
  deleteVoucher,
  updateVoucher,
  checkVoucher,
  createVoucher,
  applyIsExpiredToVouchers,
} = require("../controllers/voucher.controller");
const verifyTokenMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", getVouchers);

router.delete("/:id", deleteVoucher);

router.put("/update/:id", updateVoucher);

router.post("/checkVoucher", verifyTokenMiddleware, checkVoucher);

router.post("/", createVoucher);

router.put("/applyIsExpiredToVouchers/:id", applyIsExpiredToVouchers);

module.exports = router;
