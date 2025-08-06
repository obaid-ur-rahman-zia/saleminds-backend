const Order = require("../../models/order.model");
const express = require("express");
const sendEmail = require("../../utils/sendEmail");
// const { default: Stripe } = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_CLIENT_SECRET);

const router = express.Router();

router.get("/successcheckout", async (req, res, next) => {
  try {
    res.status(200).send("Payment Successful");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/declinecheckout", async (req, res, next) => {
  try {
    res.status(200).send("Payment Declined");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.post("/create-payment-intent", async (req, res, next) => {
//   // Create a PaymentIntent with the order amount and currency
//   console.log("req.body", req.body);
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: req.body.cartTotal * 100,
//     currency: "usd",
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//     description: "Software development services",
//   });

//   const tempOrders = req.body.cartItems.map((item) => {
//     const invoiceNumber = new Date().toISOString().replace(/\D/g, "");

//     let counter = 1;
//     return {
//       product: item.product,
//       productId: item.productId,
//       categoryId: item.categoryId,
//       userId: req.body.user._id,
//       shipping: {
//         ...item.shipping,
//         invoiceNumber: invoiceNumber,
//         shipments: item.shipping.shipments.map((shipment) => {
//           const currentDate = new Date().toISOString().replace(/\D/g, "");
//           return {
//             ...shipment,
//             sets: shipment.sets.map((set) => {
//               const randomSuffix = Math.floor(counter).toString().padStart(3, "0");
//               counter++;
//               return {
//                 ...set,
//                 status: "pending",
//                 jobId: `JB${currentDate}-${randomSuffix}`,
//               };
//             }),
//           };
//         }),
//       },
//       total: item.total,
//       paymentDetails: {
//         ...req.body.payment,
//         paymentIntentId: paymentIntent.id,
//         paymentStatus: "pending",
//       },
//       status: "pending",
//       orderDate: req.body.orderDate,
//     };
//   });

//   try {
//     const newOrder = await Order.insertMany(tempOrders);

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//       orderIds: newOrder.map((value, index) => {
//         return value._id;
//       }),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/checkout", async (req, res, next) => {
  const data = await req.body;

  // const sessionItems = data.cartItems.map((value, index) => {
  //   return {
  //     price_data: {
  //       currency: "usd",
  //       product_data: {
  //         name: value.productName,
  //       },
  //       unit_amount: parseInt(value.shipping.setPrice + value.shipping.taxPrice) * 100,
  //     },
  //     quantity: value.shipping.totalSets,
  //   };
  // });

  // console.log("sessionItems", sessionItems);
  const invoiceNumber = new Date().toISOString().replace(/\D/g, "");
  const tempOrders = req.body.cartItems.map((item) => {
    let counter = 1;
    return {
      product: item.product,
      productId: item.productId,
      categoryId: item.categoryId,

      shipping: {
        ...item.shipping,
        shipments: item.shipping.shipments.map((shipment) => {
          const currentDate = new Date().toISOString().replace(/\D/g, "");
          return {
            ...shipment,
            sets: shipment.sets.map((set) => {
              const randomSuffix = Math.floor(counter).toString().padStart(3, "0");
              counter++;
              return {
                ...set,
                status: "pending",
                jobId: `JB${currentDate}-${randomSuffix}`,
              };
            }),
          };
        }),
      },
      total: item.total,
    };
  });

  //@ts-ignore
  try {
    const session = await stripe.checkout.sessions.create({
      // line_items: sessionItems,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "test",
            },
            unit_amount: data.grandTotal * 100,
          },
          quantity: 1,
        },
      ],
      currency: "usd",
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}checkout`,
      billing_address_collection: "required",
      // payment_method_types: ["card"],
    });
    const newOrder = await Order.create({
      cartItems: tempOrders,
      invoiceNo: invoiceNumber,
      userId: req.body.user._id,
      paymentDetails: {
        ...req.body.payment,
        paymentStatus: "pending",
        billingAddress: null,
        details: null,
        paymentMethod: "stripe",
      },
      status: "pending",
      coupon: req.body.coupon,
      rewardPoints: req.body.rewardPoints,
      cartTotal: req.body.cartTotal,
      orderDate: req.body.orderDate,
      grandTotal: req.body.grandTotal,
    });

    const returnObj = {
      status: "accepted",
      session: session,
      orderId: newOrder._id,
    };

    res.send(returnObj);
  } catch (err) {
    const returnObj = {
      status: "decline",
      error: err,
    };
    res.send(returnObj);
  } finally {
  }
});

router.post("/get-session-data", async (req, res, next) => {
  try {
    const { checkoutSessionId } = req.body;
    const sessionInfo = await stripe.checkout.sessions.retrieve(checkoutSessionId);

    if (!sessionInfo) {
      return res.status(400).send("Couldnt retreive data");
    }

    res.status(200).send(sessionInfo);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/update-order-status", async (req, res, next) => {
  try {
    const { orderId, paymentObject } = req.body;

    const updateData = {
      "paymentDetails.paymentStatus": "paid",
      "paymentDetails.details": paymentObject,
      "paymentDetails.billingAddress": {
        firstName: paymentObject.customer_details.name.split(" ")[0],
        lastName: paymentObject.customer_details.name.split(" ")[1],
        streetAddress: paymentObject.customer_details.address.line1,
        city: paymentObject.customer_details.address.city,
        state: paymentObject.customer_details.address.state,
        zipCode: paymentObject.customer_details.address.postal_code,
        country: paymentObject.customer_details.address.country,
        phoneNumber: null,
      },
    };
    const updatedOrders = await Order.updateMany(
      { _id: { $in: orderId } },
      { $set: updateData },
      { new: true }
    );

    const newOrder = await Order.find({ _id: { $in: orderId } });
    // console.log("newOrder", newOrder[0].grand);
    // const invoice = orderInvoice(newOrders, req.body.user.email);

    res.status(200).json({
      total: newOrder[0].grandTotal,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const orderInvoice = async (tempOrders, email) => {
  const formatShippingAddress = (address) => {
    // Format the shipping address based on your requirements
    return `
      ${address.firstName} ${address.lastName}<br>
      ${address.streetAddress}<br>
      ${address.city}, ${address.state} ${address.zipCode}<br>
      ${address.country}<br>
      Phone: ${address.phoneNumber}
    `;
  };

  // Function to format the sets information
  const formatSets = (sets) => {
    return sets
      .map((set) => {
        return `
        <tr>
          <td>${set.name}</td>
          <td>${set.status}</td>
          <td>${set.jobId}</td>
        </tr>
      `;
      })
      .join("");
  };

  // HTML template for the invoice
  let head = `
          <html>
            <head>
              <style>
                /* Add your styles for the invoice here */
                body {
                  font-family: 'Arial', sans-serif;
                }
                .invoice {
                  border-collapse: collapse;
                  width: 100%;
                  margin-top: 20px;
                }
                .invoice th, .invoice td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                .invoice th {
                  background-color: #f2f2f2;
                }
              </style>
            </head>
            <body>`;

  for (let i = 0; i < tempOrders.length; i++) {
    let temp = `  <h2>Invoice</h2>
        <p>Invoice Number: ${tempOrders[i].shipping.invoiceNumber}</p>
        <p>Order Date: ${tempOrders[i].orderDate}</p>
  
        <h3>Product Details</h3>
        <table class="invoice">
          <thead>
            <tr>
              <th>Product Attribute</th>
              <th>Value</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(tempOrders[i].product)
              .map((attribute) => {
                const { value, price } = tempOrders[i].product[attribute];
                return `
                <tr>
                  <td>${attribute}</td>
                  <td>${value}</td>
                  <td>$${price}</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
  
        <h3>Shipping Details</h3>
        <p>Project Name: ${tempOrders[i].shipping.projectName}</p>
        <p>Shipping Address:</p>
        <p>${formatShippingAddress(tempOrders[i].shipping.shipments[0].shippingAddress)}</p>
        <table class="invoice">
          <thead>
            <tr>
              <th>Set Name</th>
              <th>Status</th>
              <th>Job ID</th>
            </tr>
          </thead>
          <tbody>
            ${formatSets(tempOrders[i].shipping.shipments[0].sets)}
          </tbody>
        </table>
        <p>Total Sets: ${tempOrders[i].shipping.totalSets}</p>
        <p>Shipping Method: ${tempOrders[i].shipping.shipments[0].shippingMethod.name}</p>
  
        <h3>Payment Details</h3>
        <p>Total: $${tempOrders[i].total}</p>
        <p>Billing Address:</p>
        <p>${formatShippingAddress(tempOrders[i].paymentDetails.billingAddress)}</p>
        <hr style={{margin-top:10px;margin-bottom:10px}}></hr>`;

    head += temp;
  }

  const foot = `
                  </body>
                </html>
              `;

  const emailBody = head + foot;

  try {
    await sendEmail(email, `Order`, emailBody);
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
