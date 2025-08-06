const express = require("express");
const router = express.Router();

const { create_Customer_OrderSummary, create_Product_SalesSummary, create_OrderSummary, create_Order_DetailsSummary, create_Order_Product_DetailSummary, create_TaxSummary, create_ShippingSummary, create_CouponSummary } = require("../controllers/reporting.controller");

router.post("/create-customer-order-summary", create_Customer_OrderSummary);

router.post("/create-product-sales-summary", create_Product_SalesSummary);

router.post("/create-order-summary", create_OrderSummary);

router.post("/create-order-detail-summary", create_Order_DetailsSummary);

router.post("/create-order-product-detail-summary", create_Order_Product_DetailSummary);

router.post("/create-shipping-summary", create_ShippingSummary);

router.post("/create-tax-summary", create_TaxSummary);

router.post("/create-coupon-summary", create_CouponSummary);

module.exports = router;