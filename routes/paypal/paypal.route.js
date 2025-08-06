const express = require("express");
const { createOrder, captureOrder } = require("../../lib/paypal");

const router = express.Router();

router.post("/create-order", async (req, res, next) => {
  try {
    // *** NOTE: This is a temporary solution to get the merchant email address. ***
    // ***       This will be replaced by a database query once the database is set up. ***
    // const shopData = await ShopData.findAll({ order: [["id", "ASC"]] });
    // const merchant_email = shopData[0]?.paypal?.merchantId;

    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart, isSandbox, amount_total } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(
      cart,
      isSandbox,
      amount_total,
      "hammadamjadali30@gmail.com"
      // merchant_email // *** NOTE: This is a temporary solution to get the merchant email address. ***
    );
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

router.post("/orders/:orderID/capture", async (req, res, next) => {
  try {
    const { orderID } = req.params;
    const { isSandbox } = req.body;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID, isSandbox);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

module.exports = router;
