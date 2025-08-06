const Order = require("../models/order.model"); // Update the path accordingly
const OrderNotes = require("../models/orderNotes.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const sendEmail = require("../utils/sendEmail");
const email = require("../models/email.model");
const pdf = require("html-pdf");
const orderPrintPDFTemplate = require("../utils/orderInvoice");
const { createLog } = require("./log.controller");
const path = require("path");

const Settings = require("../models/settings.model")

const OrderStatus = require("../models/orderStatus.model");


const fs = require('fs');

const {
  addTrackingNumberEmailTemplate,
  sendNotificationOfOrderModifications,
  sendOrderEmailTemplate,
} = require("../commons/emailTemplates");

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId") // Populating the user associated with the order
      .exec();
    res.json({ status: "success", data: orders });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const orderList = async (req, res, next) => {
  try {

    console.log("Fetching Orders... ");


    const orders = await Order.find()
      .populate("userId")
      .exec();


    const OrderStatuses = await OrderStatus.find();

    let AllOrders = [];

    orders.forEach((order) => {
      let orderStatsLabel =
        OrderStatuses.find((s) => s._id.toString() === order.status.toString())?.statusTitle ||
        order.status.toString();

      AllOrders.push({
        _id: order._id.toString(),
        invoiceNo: order.invoiceNo,
        customerName: order?.userId?.firstName + " " + order?.userId?.lastName,
        customerEmail: order?.userId?.email,
        totalAmount: order.grandTotal,
        orderDate: order.orderDate,
        status: orderStatsLabel,
        coupon: order.coupon,
        trackingNumber: order.trackingNumber,
        isArchived: order.isArchived,
        paymentDetails: order?.paymentDetails?.paymentMethod,
      });
    });

    console.log("All Orders: ", AllOrders);

    res.status(200).json({
      data: AllOrders
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllOrderByUserId = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId, isArchived: false })
      .populate("status")
      .populate("cartItems.productId")
      .populate("cartItems.categoryId")
      .populate("cartItems.shipping.shipments.sets.status")

      .exec();

    // let AllOrders = []

    // orders.forEach((order) => {

    //   // i have product status in cartItems

    //   let cartItems = []

    //   order.cartItems.forEach(item => {
    //     let cartItem = {}
    //     cartItem.product = item.product
    //     cartItem.categoryId = item.categoryId
    //     cartItem.productId = item.productId
    //     cartItem.total = item.total

    //     let shipmentData = []

    //     item.shipping.shipments.map((shipment) => {

    //       let newSets = []

    //       shipment.sets.map((set) => {
    //         let productStatus = OrderStatuses.find(s => s._id.toString() === set.status.toString())?.statusTitle || 'Unknown'

    //         let oldSetData = {}

    //         oldSetData.artwork = set.artwork
    //         oldSetData.jobId = set.jobId
    //         oldSetData.name = set.name
    //         oldSetData.status = productStatus

    //         newSets.push(oldSetData)

    //       })

    //       shipmentData.push({
    //         dropshipAddress: shipment.dropshipAddress,
    //         shippingAddress: shipment.shippingAddress,
    //         shippingMethod: shipment.shippingMethod,
    //         upsAddress: shipment.upsAddress,
    //         sets: newSets
    //       })

    //     })

    //     cartItem.shipping = {
    //       projectName: item.shipping.projectName,
    //       quantity: item.shipping.quantity,
    //       setPrice: item.shipping.setPrice,
    //       taxPrice: item.shipping.taxPrice,
    //       totalSets: item.shipping.totalSets,
    //       uploadArtworkLater: item.shipping.uploadArtworkLater,
    //       shipments: shipmentData
    //     }

    //     cartItems.push(cartItem)

    //   })

    //   order.cartItems = cartItems

    //   AllOrders.push({
    //     cartItems: cartItems,
    //     cartTotal: order.cartTotal,
    //     coupon: order.coupon,
    //     createdOn: order.createdOn,
    //     invoiceNo: order.invoiceNo,
    //     isArchived : order.isArchived,
    //     orderDate: order.orderDate,
    //     paymentDetails : order.paymentDetails,
    //     rewardPoints: order.rewardPoints,
    //     grandTotal: order.grandTotal,
    //     status : orde,
    //     trackingNumber: order.trackingNumber,
    //     userId: order.userId,
    //     _id : order._id.toString()
    //   })

    // })

    res.json({ status: "success", data: orders });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getArchivedOrderByUserId = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId, isArchived: true })
      .populate("status")
      .populate("cartItems.productId")
      .populate("cartItems.categoryId")
      .populate("cartItems.shipping.shipments.sets.status")

      .exec();
    res.json({ status: "success", data: orders });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createNewOrder = async (req, res, next) => {
  const tempOrders = req.body.cartItems.map((item) => {
    const invoiceNumber = new Date().toISOString().replace(/\D/g, "");

    let counter = 1;
    return {
      product: item.product,
      productId: item.productId,
      categoryId: item.categoryId,
      userId: req.body.user._id,
      shipping: {
        ...item.shipping,
        invoiceNumber: invoiceNumber,
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
      paymentDetails: req.body.payment,
      status: "pending",
      orderDate: req.body.orderDate,
    };
  });

  try {
    // let str = JSON.stringify(tempOrders);
    // str = JSON.stringify(tempOrders, null, 4); // (Optional) beautiful indented output.
    // console.log(str);
    const newOrder = await Order.insertMany(tempOrders);

    // Function to format the shipping address
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

    // Use the `htmlInvoice` in your Node Mailer email configuration
    // ...

    // ******** for email **********
    await sendEmail(req.body.user.email, `Order #${newOrder._id}`, head + foot);
    await createLog("New Order of " + newOrder.length + " items is created");
    res.status(201).json("Order created successfully");
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId })
      .populate("status")
      .populate("cartItems.productId")
      .populate("cartItems.categoryId")
      .populate("cartItems.shipping.shipments.sets.status");
    const responseObj = order.cartItems.map((cartItem) => {
      const setsDetails = cartItem.shipping.shipments.map((item) => {
        return {
          sets: item.sets,
        };
      });
      return {
        setDetails: setsDetails,
        projectName: cartItem.shipping.projectName,
      };
    });
    await createLog("Someone track the Order with id " + req.params.orderId);
    res.json(responseObj);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getOrderByID = async (req, res, next) => {
  try {
    let order = await Order.findOne({ _id: req.params.orderId })
      .populate("userId") // Populating the user associated with the order
      .populate("status")
      .populate("cartItems.shipping.shipments.sets.status")
      .exec();
    // Populate the product and category details of each item in cartItems

    console.log("Order Detail: ", order);

    let newCartItems = await Promise.all(
      order.cartItems.map(async (item) => {
        // Retrieve category and product details for each item
        const cartItemCategory = await Category.findOne({ _id: item.categoryId });
        const cartItemProduct = await Product.findOne({ _id: item.productId });

        // Returning an object with item details, category, and product
        return {
          product: item.product,
          shipping: item.shipping,
          total: item.total,
          categoryId: cartItemCategory, // Adding category details
          productId: cartItemProduct, // Adding product details
        };
      })
    );

    console.log("CartItems: ", newCartItems);

    // Assigning the populated cart items back to the order
    order.cartItems = newCartItems;

    if (!order) {
      return res.status(404).json({ status: "failed", message: "Order not found" });
    }

    // const OrderStatuses = await OrderStatus.find();

    // let orde = OrderStatuses.find(s => s._id.toString() === order.status.toString())?.statusTitle || 'Unknown'

    // // i have product status in cartItems

    // let cartItems = []

    // order.cartItems.forEach(item => {
    //   let cartItem = {}
    //   cartItem.product = item.product
    //   cartItem.categoryId = item.categoryId
    //   cartItem.productId = item.productId
    //   cartItem.total = item.total

    //   let shipmentData = []

    //   item.shipping.shipments.map((shipment) => {

    //     let newSets = []

    //     shipment.sets.map((set) => {
    //       let productStatus = OrderStatuses.find(s => s._id.toString() === set.status.toString())?.statusTitle || 'Unknown'

    //       let oldSetData = {}

    //       oldSetData.artwork = set.artwork
    //       oldSetData.jobId = set.jobId
    //       oldSetData.name = set.name
    //       oldSetData.status = productStatus

    //       newSets.push(oldSetData)

    //     })

    //     shipmentData.push({
    //       dropshipAddress: shipment.dropshipAddress,
    //       shippingAddress: shipment.shippingAddress,
    //       shippingMethod: shipment.shippingMethod,
    //       upsAddress: shipment.upsAddress,
    //       sets: newSets
    //     })

    //   })

    //   cartItem.shipping = {
    //     projectName: item.shipping.projectName,
    //     quantity: item.shipping.quantity,
    //     setPrice: item.shipping.setPrice,
    //     taxPrice: item.shipping.taxPrice,
    //     totalSets: item.shipping.totalSets,
    //     uploadArtworkLater: item.shipping.uploadArtworkLater,
    //     shipments: shipmentData
    //   }

    //   cartItems.push(cartItem)

    // })

    // order.cartItems = cartItems

    // order.status = orde

    res.json({ status: "success", data: order });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateOrder = async (req, res, next) => {
  try {
    //update the whole order object from req.body and id from params
    const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    await createLog(`Update Order detail id ${order._id} by ${req.user.name} `);

    res.status(200).json({ message: "Order updated Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    await createLog(`Update status of order id ${order._id} by ${req.user.name} `);

    res.status(200).json({ message: "Order Status Updated." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const addTrackingNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    if (!order) {
      return res.status(404).json({ status: "failed", message: "Order not found" });
    }

    order.trackingNumber = req.body.trackingNumber;
    await order.save();

    const result = await sendEmail(
      req.body.email,
      "Your Order Confirmation and Tracking Information",
      addTrackingNumberEmailTemplate(req.body.trackingNumber)
    );
    const newEmailSent = new email({
      receiver: req.body.email,
      subject: addTrackingNumberEmailTemplate(req.body.trackingNumber),
      sendingStatus: result.success,
    });

    await newEmailSent.save();
    res
      .status(200)
      .json({ status: "success", message: "Tracking Number is Updated Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const markOrderAsArcheive = async (req, res, next) => {
  console.log("Params: ", req.params.orderId);

  try {
    const order = await Order.findOne({ invoiceNo: req.params.orderId });

    console.log("Order: ", order);

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    order.isArchived = !order.isArchived;

    await order.save();

    res.status(200).json({
      message: `Order marked as ${order.isArchived ? "archived" : "un-archived"}.`,
    });

    await createLog(
      `Order marked as ${order.isArchived ? "archived" : "un-archived"} of id ${order._id} by ${req.user.name
      } `
    );
  } catch (err) {
    console.error(err);
    next(err)
  }
};



const genrateOrderInvoiceInPDF = async (req, res, next) => {

  console.log(`Requesting invoice of order ${req.params.orderId}`)


  try {

    const order = await Order.findById(req.params.orderId)
      .populate("userId") // Populating the user associated with the order
      .populate("status")
      .populate("cartItems.shipping.shipments.sets.status")
      .exec();

    console.log("Order: ", order)



    if (!order) {
      return res.status(404).json({ status: "failed", message: "Order not found" });
    }
    const settings = Settings.findOne();
    pdf
      .create(sendOrderEmailTemplate(order, settings), {})
      .toFile(
        path.join(__dirname, "..", "public", "downloads", "invoices", `${req.params.orderId}.pdf`),
        (err) => {

          console.log("Error: ", err)
          if (err) {
            console.error(err);
            next(err)
          }

          let url = path.join('public', 'downloads', 'invoices', `${req.params.orderId}.pdf`);

          res.send({ status: true, url: url });
        }
      );
  } catch (error) {
    console.error(error);
    next(error)
  }
};


const getGenrateOrderInvoicePDF = async (req, res, next) => {

  const filePath = path.join(__dirname, "..", "public", "downloads", "invoices", `${req.params.orderId}.pdf`);

  console.log("File Path: ", filePath)

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }



  res.download(filePath);
};


const genrateAndSendOrderInvoiceInPDF = async (req, res, next) => {
  try {


    let order = await Order.findOne({ _id: req.body.orderId })
      .populate("userId") // Populating the user associated with the order
      .populate("status")
      .populate("cartItems.shipping.shipments.sets.status")
      .exec();
    // Populate the product and category details of each item in cartItems

    if (!order) {
      return res.status(404).json({ status: "failed", message: "Order not found" });
    }

    console.log("Order: ", order)
    const settings = await Settings.findOne();

    pdf
      .create(sendOrderEmailTemplate(order, settings), {})
      .toFile(
        path.join(__dirname, "..", "public", "downloads", "invoices", `${req.body.orderId}.pdf`),
        async (err) => {

          if (err) {
            console.error(err);
            next(err)
          }

          const settings = await Settings.findOne();
          const htmlContent = sendOrderEmailTemplate(order, settings);
          const pdfPath = `/public/uploads/temp/${order._id}.pdf`;

          await convertHtmlToPdf(htmlContent, pdfPath);

          const attachments = [
            {
              filename: `${order._id}.pdf`,
              path: pdfPath,
              contentType: "application/pdf",
            },
          ];

          await sendEmail(
            req.user.email,
            `Resending: Order Invoice #${order._id}`,
            `<div>
              <h3>Hello ${req.user.firstName},</h3>
              <p>
                As requested, we are resending a copy of your invoice for order #${order._id}.
              </p>
              <p>
                You can view and manage your order by 
                <a href="${settings.storeURL}/login" target="_blank">logging into your account</a>. 
                If you have any questions, please don't hesitate to contact us at 
                <a href="mailto:${settings.email}">${settings.email}</a>.
              </p>
              <p>
                Thank you for choosing ${settings.storeName}. We appreciate your business!
              </p>
              <p>Best regards,<br/>${settings.storeName}</p>
            </div>`,
            attachments
          );


          res.status(200).json({ status: true });


        }
      );


  }
  catch (error) {
    console.error(error);
    next(error)
  }
}


const addNewOrderStatus = async (req, res, next) => {
  try {
    console.log("Adding New Status");

    console.log("Req.body: ", req.body);

    const {
      statusType,
      setAs,
      statusTitle,
      colorClass,
      useOnJobBoard,
      internalStatus,
      allowCancellation,
      allowInvoiceDownload,
      status,
      notifyCustomer,
      notifyAdmin,
      isDefault,
    } = req.body;

    console.log("Status Title: ", statusTitle);

    const checkAlreadyPresentWithSameTitle = await OrderStatus.findOne({
      statusTitle: statusTitle,
    });

    // check if default status is already present with same type.

    let checkIfDefaultStatusAlreadyPresent;

    if (isDefault) {

      checkIfDefaultStatusAlreadyPresent = await OrderStatus.find({
        statusType: statusType,
        isDefault: true,
      });

    }



    console.log("checkAlreadyPresentWithSameTitle: ", checkAlreadyPresentWithSameTitle);

    if (checkAlreadyPresentWithSameTitle) {
      return res.status(400).json({ message: "Order Status with same Title already exists" });
    }

    if (checkIfDefaultStatusAlreadyPresent) {
      return res.status(400).json({ message: `Only one ${statusType} is allowed to be default.` });
    }

    const addNewStatus = new OrderStatus({
      statusType: statusType,
      setAs: setAs,
      statusTitle: statusTitle,
      colorClass: colorClass,
      useOnJobBoard: useOnJobBoard,
      internalStatus: internalStatus,
      allowCancellation: allowCancellation,
      allowInvoiceDownload: allowInvoiceDownload,
      status: status,
      notifyCustomer: notifyCustomer,
      notifyAdmin: notifyAdmin,
      isDefault: isDefault,
    });

    await addNewStatus.save();

    console.log("Successfully Added.");

    res.status(200).json({ message: "Order Status added successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const editOrderStatus = async (req, res, next) => {
  try {
    const {
      statusType,
      setAs,
      statusTitle,
      colorClass,
      useOnJobBoard,
      internalStatus,
      allowCancellation,
      allowInvoiceDownload,
      status,
      notifyCustomer,
      notifyAdmin,
      isDefault,
    } = req.body;

    const updateOrderStatus = new OrderStatus.findByIdAndUpdate(
      req.params.statusId,
      {
        statusType: statusType,
        setAs: setAs,
        statusTitle: statusTitle,
        colorClass: colorClass,
        useOnJobBoard: useOnJobBoard,
        internalStatus: internalStatus,
        allowCancellation: allowCancellation,
        allowInvoiceDownload: allowInvoiceDownload,
        status: status,
        notifyCustomer: notifyCustomer,
        notifyAdmin: notifyAdmin,
        isDefault: isDefault,
      },
      { new: true }
    );

    if (!updateOrderStatus) {
      return res.status(404).json({ message: "Order Status not found" });
    }

    res.status(200).json({ message: "Order Status updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteOrderStatus = async (req, res, next) => {
  try {
    // check if there is only

    const deleteOrderStatus = await OrderStatus.findOneAndDelete({ _id: req.params.statusId });
    if (!deleteOrderStatus) {
      return res.status(400).json({ message: "Order Status not found" });
    }
    res.status(200).json({ message: "Order Status deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const fetchOrderStatus = async (req, res, next) => {
  try {
    const listOrderStatus = await OrderStatus.find();

    console.log("List of Order status: ", listOrderStatus);

    if (!listOrderStatus) {
      return res.status(404).json({ message: "No Order Status found" });
    }

    res.status(200).json({ data: listOrderStatus });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// const prepareDataForExport = async (req, res, next) => {
//   try {

//     const { orderRange, startDate, endDate, orderNo } = req.body

//     const order = await Order.find()
//       .populate("userId") // Populating the user associated with the order
//       .exec();
//     // Populate the product and category details of each item in cartItems

//     let AllOrders = []

//     order.map( async (o)=>{
//       const newCartItems = await Promise.all(
//         order.cartItems.map(async (item) => {
//           // Retrieve category and product details for each item
//           const cartItemProduct = await Product.findOne({ _id: item.productId });
//           // Returning an object with item details, category, and product
//           return {
//             product: item.product,
//             shipping: item.shipping,
//             total: item.total,
//             productId: cartItemProduct, // Adding product details
//           };
//         })
//       );
//       // Assigning the populated cart items back to the order
//       o.cartItems = newCartItems;
//       AllOrders.push(o)
//     })

//     let selectedContextOrders = []

//     if (orderRange === 'all_order') {

//       selectedContextOrders = AllOrders

//     }
//     else if (orderRange === 'all_order_date_range') {
//       if (startDate === "" || endDate === "") {
//         alert("Please Select valid date range.")
//       }
//       else if (formObj.startDate !== "" && formObj.endDate !== "" && formObj.orderRange === 'specific_order') {
//         const filteredData = allAvailableOrders.filter(order => {
//           const orderDate = new Date(order.createdOn);
//           const start = new Date(startDate);
//           const end = new Date(endDate);

//           return orderDate >= start && orderDate <= end;
//         });

//         dataToExport = filteredData

//       }
//     }
//     else if (formObj.orderRange === 'specific_order') {
//       if (formObj.orderNo !== "") {
//         dataToExport = allAvailableOrders.filter(order => order.invoiceNo === formObj.orderNo);
//         if (dataToExport.length === 0) {
//           alert("Error. No matching order found.");
//           setIsAdding(false);
//           return;
//         }
//       } else {
//         alert("Error. Please enter a valid Order No.");
//         setIsAdding(false);
//         return;
//       }
//     }

//     console.log("Selected Orders: ",selectedContextOrders)

//     let dataReadyForExported = []

//     selectedContextOrders.map((order) => {

//       // make a list of cart Items like this Business Card, Seudu Card

//       let cartItems = []

//       order.cartItems.map((item) => {
//         cartItems.push(item.productId.name)
//       })

//       dataReadyForExported.push({
//         "Order Id": order._id,
//         "Invoice No": order.invoiceNo,
//         "Customer Name": `${order.paymentDetails.billingAddress.firstName} ${order.paymentDetails.billingAddress.lastName}`,
//         "Cart Items": cartItems.join(",")
//       })
//     })

//     console.log("Data ready for exported: ",dataReadyForExported)

//     return res.status(200).json({ data: dataReadyForExported })

//   }
//   catch (error) {

//     console.log("Error: ", error)
//     res.status(500).json({ message: "Error in preparing data for export" });

//   }
// }

const uploadAndGenrateURL = async (req, res, next) => {
  try {
    if (!req.file || req.file.length === 0) {
      return res.status(400).json({ message: "Please upload at least one file." });
    }

    let newImage = `${req.file.destination}${req.file.filename}`;

    // console.log("URL For Uploaded File: ", newImage);

    return res.status(200).json({ data: { url: newImage } });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const addNewOrderNotes = async (req, res, next) => {
  try {
    console.log("Request::: ", req.body);

    const { type, noteFor, uploadURL, comment, notifyCustomer, orderId, user } = req.body;

    const newOrderNotes = new OrderNotes({
      type: type,
      noteFor: noteFor,
      uploadURL: uploadURL,
      comment: comment,
      notifyCustomer: notifyCustomer,
      orderId: orderId,
      authorName: req.user ? req.user.name : user.name,
      authorEmail: req.user ? req.user.email : user.email,
    });

    await newOrderNotes.save();

    let OrderDetail = await Order.findOne({ _id: req.body.orderId })
      .populate("userId") // Populating the user associated with the order
      .populate("status")
      .populate("cartItems.shipping.shipments.sets.status")
      .exec();

    const settings = await Settings.findOne();
    const message = "New Message from ${settings.storeName} Team";
    if (notifyCustomer && newOrderNotes) {
      if (OrderDetail?.userId?.email) {
        const EmailTemplate = sendNotificationOfOrderModifications(
         OrderDetail,
         settings,
        );

        await sendEmail(
          OrderDetail?.userId?.email,
          message,
          EmailTemplate
        );
      }
    }

    if (newOrderNotes) {
      await createLog("Added New Order Note For Order Id " + orderId + " by " + req.user.name);

      res.status(200).json({
        message: "Add New Order Notes created successfully.",
      });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const fetchAOrderNotes = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const allOrderNotes = await OrderNotes.find({ orderId: orderId });

    // If you need it in descending order, use:
    allOrderNotes.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

    return res.status(200).json({ data: allOrderNotes });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  getAllOrders,
  createNewOrder,
  getAllOrderByUserId,
  trackOrder,
  getOrderByID,
  updateOrderStatus,
  updateOrder,
  addTrackingNumber,
  markOrderAsArcheive,
  genrateOrderInvoiceInPDF,
  getGenrateOrderInvoicePDF,
  getArchivedOrderByUserId,
  addNewOrderStatus,
  editOrderStatus,
  deleteOrderStatus,
  fetchOrderStatus,
  orderList,
  uploadAndGenrateURL,
  addNewOrderNotes,
  addNewOrderNotes,
  fetchAOrderNotes,
  genrateAndSendOrderInvoiceInPDF
  //  prepareDataForExport
};
