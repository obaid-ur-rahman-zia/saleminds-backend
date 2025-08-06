const { APIControllers, APIContracts } = require("authorizenet");
const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const Order = require("../../models/order.model");
const sendEmail = require("../../utils/sendEmail");
const { sendOrderEmailTemplate } = require("../../commons/emailTemplates");
const Settings = require("../../models/settings.model");
var SDKConstants = require("authorizenet").Constants;
const pdf = require("html-pdf");
const { default: puppeteer } = require("puppeteer");
const { default: jsPDF } = require("jspdf");
const html2canvas = require("html2canvas");
const { createCanvas, loadImage } = require("canvas");
const orderStatusModel = require("../../models/orderStatus.model");
function generateId(count) {
  return String(count).padStart(10, "0");
}
const getNewOrderObject = async (data, paymentInfo, transactionResponse, paymentType) => {
  try {
    const orderCount = await Order.countDocuments();

    const defaultOrderStatuses = await orderStatusModel.find({
      isDefault: true,
    });

    console.log("defaultOrderStatuses", defaultOrderStatuses);
    console.log("data", data);
    console.log("data.currUser", data.user);

    // let nextOrderId = 1; // Default to 1 if no orders are found in the database
    let nextOrderId = orderCount + 1;

    const invoiceNumber = generateId(orderCount + 1);
    const tempOrders = data.cartItems.map((item) => {
      let counter = 1;
      return {
        product: item.product,
        productId: item.productId,
        categoryId: item.categoryId,
        productName: item.productName,
        additionalPrices: item.additionalPrices,
        productSKU: item.productSKU,

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
                  status: defaultOrderStatuses.find((el) => el.statusType == "orderProductStatus")
                    ._id,
                  // status: "Pending",
                  jobId: `JB${currentDate}-${randomSuffix}`,
                };
              }),
            };
          }),
        },
        total: item.total,
      };
    });
    // console.log("data.currUser", data.currUser);
    return {
      _id: nextOrderId,
      cartItems: tempOrders,
      invoiceNo: invoiceNumber,
      userId: data.user._id,

      paymentDetails: {
        ...transactionResponse,
        ...data.payment,
        paymentMethod: "authorize-net",
        cardInfo: paymentType === "credit-card" ? paymentInfo : null,
        bankInfo: paymentType === "bank-account" ? paymentInfo : null,
        paymentType: paymentType,
      },
      status: defaultOrderStatuses.find((el) => el.statusType == "orderStatus")._id,
      coupon: data.coupon,
      rewardPoints: data.rewardPoints,
      cartTotal: data.cartTotal,
      orderDate: data.orderDate,
      grandTotal: data.grandTotal,
    };
  } catch (error) {
    console.log("error", error);
  }
};

router.post("/charge-bank", (req, res, next) => {
  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName("8Pn84ReSv");
  merchantAuthenticationType.setTransactionKey("39MaCC977qYmjJ2M");

  var bankAccountType = new APIContracts.BankAccountType();
  bankAccountType.setAccountType(req.body.bankInfo.accountType);
  bankAccountType.setRoutingNumber(req.body.bankInfo.routingNumber);
  //added code
  bankAccountType.setAccountNumber(req.body.bankInfo.accountNumber);
  // var bankAccountNum = Math.floor(Math.random() * 9999999999) + 10000;
  // bankAccountType.setAccountNumber(bankAccountNum.toString());
  bankAccountType.setNameOnAccount(req.body.bankInfo.nameOnAccount);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setBankAccount(bankAccountType);

  // var orderDetails = new APIContracts.OrderType();
  // orderDetails.setInvoiceNumber("INV-12345");
  // orderDetails.setDescription("Product Description");

  // var tax = new APIContracts.ExtendedAmountType();
  // tax.setAmount("4.26");
  // tax.setName("level2 tax name");
  // tax.setDescription("level2 tax");

  // var duty = new APIContracts.ExtendedAmountType();
  // duty.setAmount("8.55");
  // duty.setName("duty name");
  // duty.setDescription("duty description");

  // var shipping = new APIContracts.ExtendedAmountType();
  // shipping.setAmount("8.55");
  // shipping.setName("shipping name");
  // shipping.setDescription("shipping description");

  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(req.body.checkout.payment.billingAddress.firstName);
  billTo.setLastName(req.body.checkout.payment.billingAddress.lastName);
  billTo.setCompany(req.body.checkout.payment.billingAddress.company);
  billTo.setAddress(req.body.checkout.payment.billingAddress.streetAddress);
  billTo.setCity(req.body.checkout.payment.billingAddress.city);
  billTo.setState(req.body.checkout.payment.billingAddress.state);
  billTo.setZip(req.body.checkout.payment.billingAddress.zipCode);
  billTo.setCountry(req.body.checkout.payment.billingAddress.country);

  // var shipTo = new APIContracts.CustomerAddressType();
  // shipTo.setFirstName("China");
  // shipTo.setLastName("Bayles");
  // shipTo.setCompany("Thyme for Tea");
  // shipTo.setAddress("12 Main Street");
  // shipTo.setCity("Pecan Springs");
  // shipTo.setState("TX");
  // shipTo.setZip("44628");
  // shipTo.setCountry("USA");

  // var lineItem_id1 = new APIContracts.LineItemType();
  // lineItem_id1.setItemId("1");
  // lineItem_id1.setName("vase");
  // lineItem_id1.setDescription("cannes logo");
  // lineItem_id1.setQuantity("18");
  // lineItem_id1.setUnitPrice("45.00");

  // var lineItem_id2 = new APIContracts.LineItemType();
  // lineItem_id2.setItemId("2");
  // lineItem_id2.setName("vase2");
  // lineItem_id2.setDescription("cannes logo2");
  // lineItem_id2.setQuantity("28");
  // lineItem_id2.setUnitPrice("25.00");

  // var lineItemList = [];
  // lineItemList.push(lineItem_id1);
  // lineItemList.push(lineItem_id2);

  // var lineItems = new APIContracts.ArrayOfLineItem();
  // lineItems.setLineItem(lineItemList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(
    req.body.checkout.grandTotal > 99 ? 90 : req.body.checkout.grandTotal
  );
  // transactionRequestType.setLineItems(lineItems);
  // transactionRequestType.setOrder(orderDetails);
  // transactionRequestType.setTax(tax);
  // transactionRequestType.setDuty(duty);
  // transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  // transactionRequestType.setShipTo(shipTo);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setRefId("123456");
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

  ctrl.execute(async function () {
    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log("Response Code: " + response.getTransactionResponse().getResponseCode());
          console.log(
            "Message Code: " +
              response.getTransactionResponse().getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Description: " +
              response.getTransactionResponse().getMessages().getMessage()[0].getDescription()
          );

          const transactionResponse = JSON.parse(JSON.stringify(response, null, 2));
          // creating new order
          const orderObject = await getNewOrderObject(
            req.body.checkout,
            req.body.bankInfo,
            transactionResponse,
            req.body.paymentType
          );

          console.log("orderObject", orderObject);
          const newOrder = await Order.create(orderObject);
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
            );
            console.log(
              "Error message: " +
                response.getTransactionResponse().getErrors().getError()[0].getErrorText()
            );
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
          );
          console.log(
            "Error message: " +
              response.getTransactionResponse().getErrors().getError()[0].getErrorText()
          );
        } else {
          console.log("Error Code: " + response.getMessages().getMessage()[0].getCode());
          console.log("Error message: " + response.getMessages().getMessage()[0].getText());
        }
      }
    } else {
      console.log("Null Response.");
    }

    res.send(response);
  });
});
router.post("/charge-credit", (req, res, next) => {
  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName("8Pn84ReSv");
  merchantAuthenticationType.setTransactionKey("39MaCC977qYmjJ2M");

  var creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(req.body.cardInfo.cardNumber.replaceAll(" ", ""));
  creditCard.setExpirationDate(req.body.cardInfo.expiry.replace("/", ""));
  creditCard.setCardCode(req.body.cardInfo.cvc);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  // var orderDetails = new APIContracts.OrderType();
  // orderDetails.setInvoiceNumber("INV-12345");
  // orderDetails.setDescription("Product Description");

  // var tax = new APIContracts.ExtendedAmountType();
  // tax.setAmount("0");
  // tax.setName("level2 tax name");
  // tax.setDescription("level2 tax");

  // var duty = new APIContracts.ExtendedAmountType();
  // duty.setAmount("0");
  // duty.setName("duty name");
  // duty.setDescription("duty description");

  // var shipping = new APIContracts.ExtendedAmountType();
  // shipping.setAmount("0");
  // shipping.setName("shipping name");
  // shipping.setDescription("shipping description");

  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(req.body.checkout.payment.billingAddress.firstName);
  billTo.setLastName(req.body.checkout.payment.billingAddress.lastName);
  billTo.setCompany(req.body.checkout.payment.billingAddress.company);
  billTo.setAddress(req.body.checkout.payment.billingAddress.streetAddress);
  billTo.setCity(req.body.checkout.payment.billingAddress.city);
  billTo.setState(req.body.checkout.payment.billingAddress.state);
  billTo.setZip(req.body.checkout.payment.billingAddress.zipCode);
  billTo.setCountry(req.body.checkout.payment.billingAddress.country);

  // var shipTo = new APIContracts.CustomerAddressType();
  // shipTo.setFirstName("China");
  // shipTo.setLastName("Bayles");
  // shipTo.setCompany("Thyme for Tea");
  // shipTo.setAddress("12 Main Street");
  // shipTo.setCity("Pecan Springs");
  // shipTo.setState("TX");
  // shipTo.setZip("44628");
  // shipTo.setCountry("USA");

  //****************
  // for cart items
  //****************
  // var lineItem_id1 = new APIContracts.LineItemType();
  // lineItem_id1.setItemId('1');
  // lineItem_id1.setName('vase');
  // lineItem_id1.setDescription('cannes logo');
  // lineItem_id1.setQuantity('18');
  // lineItem_id1.setUnitPrice(45.00);

  // var lineItem_id2 = new APIContracts.LineItemType();
  // lineItem_id2.setItemId('2');
  // lineItem_id2.setName('vase2');
  // lineItem_id2.setDescription('cannes logo2');
  // lineItem_id2.setQuantity('28');
  // lineItem_id2.setUnitPrice('25.00');

  // var lineItemList = [];
  // lineItemList.push(lineItem_id1);
  // lineItemList.push(lineItem_id2);

  // var lineItems = new APIContracts.ArrayOfLineItem();
  // lineItems.setLineItem(lineItemList);

  //****************
  // user details
  //****************
  // var userField_a = new APIContracts.UserField();
  // userField_a.setName("A");
  // userField_a.setValue("Aval");

  // var userField_b = new APIContracts.UserField();
  // userField_b.setName("B");
  // userField_b.setValue("Bval");

  // var userFieldList = [];
  // userFieldList.push(userField_a);
  // userFieldList.push(userField_b);

  // var userFields = new APIContracts.TransactionRequestType.UserFields();
  // userFields.setUserField(userFieldList);

  //****************
  // transaction settings (optional)
  //****************
  var transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName("duplicateWindow");
  transactionSetting1.setSettingValue("120");

  // var transactionSetting2 = new APIContracts.SettingType();
  // transactionSetting2.setSettingName("recurringBilling");
  // transactionSetting2.setSettingValue("false");

  var transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  // transactionSettingList.push(transactionSetting2);

  var transactionSettings = new APIContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(req.body.checkout.grandTotal);
  //   transactionRequestType.setLineItems(lineItems);
  // transactionRequestType.setLineItems();
  // transactionRequestType.setUserFields(userFields);
  // transactionRequestType.setOrder(orderDetails);
  // transactionRequestType.setTax(tax);
  // transactionRequestType.setDuty(duty);
  // transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  // transactionRequestType.setShipTo(shipTo);
  transactionRequestType.setTransactionSettings(transactionSettings);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  // console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
  //Defaults to sandbox
  //ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(async function () {
    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        // transaction successfull
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log("Response Code: " + response.getTransactionResponse().getResponseCode());
          console.log(
            "Message Code: " +
              response.getTransactionResponse().getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Description: " +
              response.getTransactionResponse().getMessages().getMessage()[0].getDescription()
          );

          const transactionResponse = JSON.parse(JSON.stringify(response, null, 2));
          // creating new order
          const orderObject = await getNewOrderObject(
            req.body.checkout,
            req.body.cardInfo,
            transactionResponse,
            "credit-card"
          );
          const newOrder = await Order.create(orderObject);
          console.log("newOrder", newOrder);

          const settings = await Settings.find();
          await sendEmail(
            req.body.user.email,
            `#Invoice DP-${newOrder._id}`,
            sendOrderEmailTemplate(newOrder, settings)
          );
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
            );
            console.log(
              "Error message: " +
                response.getTransactionResponse().getErrors().getError()[0].getErrorText()
            );
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
          );
          console.log(
            "Error message: " +
              response.getTransactionResponse().getErrors().getError()[0].getErrorText()
          );
        } else {
          console.log("Error Code: " + response.getMessages().getMessage()[0].getCode());
          console.log("Error message: " + response.getMessages().getMessage()[0].getText());
        }
      }
    } else {
      console.log("Null Response.");
    }

    // callback(response);
    res.send(response);
  });
});

function convertHtmlToPdf(htmlContent, outputPath) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlContent).toFile(outputPath, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

router.post("/accept-payment-transaction", (req, res, next) => {
  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();

  // ********  LIVE CREDENTIALS **********
  merchantAuthenticationType.setName(process.env.AUTHORIZE_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY);

  // ********  SANDBOX CREDENTIALS **********
  // merchantAuthenticationType.setName("4Bd2gM5XQ");
  // merchantAuthenticationType.setTransactionKey("395QjM84xDzJ4aVb");

  var opaqueData = new APIContracts.OpaqueDataType();
  opaqueData.setDataDescriptor(req.body.opaqueData.dataDescriptor);
  opaqueData.setDataValue(req.body.opaqueData.dataValue);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setOpaqueData(opaqueData);

  // var orderDetails = new APIContracts.OrderType();
  // orderDetails.setInvoiceNumber('INV-12345');
  // orderDetails.setDescription('Product Description');

  // var tax = new APIContracts.ExtendedAmountType();
  // tax.setAmount('4.26');
  // tax.setName('level2 tax name');
  // tax.setDescription('level2 tax');

  // var duty = new APIContracts.ExtendedAmountType();
  // duty.setAmount('8.55');
  // duty.setName('duty name');
  // duty.setDescription('duty description');

  // var shipping = new APIContracts.ExtendedAmountType();
  // shipping.setAmount('8.55');
  // shipping.setName('shipping name');
  // shipping.setDescription('shipping description');

  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(req.body.checkout.payment.billingAddress.firstName);
  billTo.setLastName(req.body.checkout.payment.billingAddress.lastName);
  billTo.setCompany(req.body.checkout.payment.billingAddress.company);
  billTo.setAddress(req.body.checkout.payment.billingAddress.streetAddress);
  billTo.setCity(req.body.checkout.payment.billingAddress.city);
  billTo.setState(req.body.checkout.payment.billingAddress.state);
  billTo.setZip(req.body.checkout.payment.billingAddress.zipCode);
  billTo.setCountry(req.body.checkout.payment.billingAddress.country);

  // var shipTo = new APIContracts.CustomerAddressType();
  // shipTo.setFirstName('China');
  // shipTo.setLastName('Bayles');
  // shipTo.setCompany('Thyme for Tea');
  // shipTo.setAddress('12 Main Street');
  // shipTo.setCity('Pecan Springs');
  // shipTo.setState('TX');
  // shipTo.setZip('44628');
  // shipTo.setCountry('USA');

  // var lineItem_id1 = new APIContracts.LineItemType();
  // lineItem_id1.setItemId('1');
  // lineItem_id1.setName('vase');
  // lineItem_id1.setDescription('cannes logo');
  // lineItem_id1.setQuantity('18');
  // lineItem_id1.setUnitPrice(45.00);

  // var lineItem_id2 = new APIContracts.LineItemType();
  // lineItem_id2.setItemId('2');
  // lineItem_id2.setName('vase2');
  // lineItem_id2.setDescription('cannes logo2');
  // lineItem_id2.setQuantity('28');
  // lineItem_id2.setUnitPrice('25.00');

  // var lineItemList = [];
  // lineItemList.push(lineItem_id1);
  // lineItemList.push(lineItem_id2);

  // var lineItems = new APIContracts.ArrayOfLineItem();
  // lineItems.setLineItem(lineItemList);

  // var userField_a = new APIContracts.UserField();
  // userField_a.setName('A');
  // userField_a.setValue('Aval');

  // var userField_b = new APIContracts.UserField();
  // userField_b.setName('B');
  // userField_b.setValue('Bval');

  // var userFieldList = [];
  // userFieldList.push(userField_a);
  // userFieldList.push(userField_b);

  // var userFields = new APIContracts.TransactionRequestType.UserFields();
  // userFields.setUserField(userFieldList);

  var transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName("duplicateWindow");
  transactionSetting1.setSettingValue("120");

  // var transactionSetting2 = new APIContracts.SettingType();
  // transactionSetting2.setSettingName('recurringBilling');
  // transactionSetting2.setSettingValue('false');

  var transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  // transactionSettingList.push(transactionSetting2);

  var transactionSettings = new APIContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(req.body.checkout.grandTotal);
  // transactionRequestType.setAmount(2);

  // transactionRequestType.setLineItems(lineItems);
  // transactionRequestType.setUserFields(userFields);
  // transactionRequestType.setOrder(orderDetails);
  // transactionRequestType.setTax(tax);
  // transactionRequestType.setDuty(duty);
  // transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  // transactionRequestType.setShipTo(shipTo);
  transactionRequestType.setTransactionSettings(transactionSettings);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  // console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
  //Defaults to sandbox
  // ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(async function () {
    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log("Response Code: " + response.getTransactionResponse().getResponseCode());
          console.log(
            "Message Code: " +
              response.getTransactionResponse().getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Description: " +
              response.getTransactionResponse().getMessages().getMessage()[0].getDescription()
          );
          const transactionResponse = JSON.parse(JSON.stringify(response, null, 2));
          // creating new order
          const orderObject = await getNewOrderObject(
            req.body.checkout,
            req.body.cardInfo,
            transactionResponse,
            req.body.paymentType
          );
          console.log("orderObject", orderObject);
          const newOrder = await (
            await (
              await (await Order.create(orderObject)).populate("cartItems.productId")
            ).populate("cartItems.categoryId")
          ).populate("cartItems.shipping.shipments.sets.status");
          // console.log("newOrder", newOrder);
          console.log("newOrder", newOrder.cartItems[0].shipping);

          const settings = await Settings.find();
          const htmlContent = sendOrderEmailTemplate(newOrder, settings[0]);
          const pdfPath = `/public/uploads/temp/${newOrder._id}.pdf`;

          await convertHtmlToPdf(htmlContent, pdfPath);

          const attachments = [
            {
              filename: `${newOrder._id}.pdf`,
              path: pdfPath,
              contentType: "application/pdf",
            },
          ];

          await sendEmail(
            req.body.user.email,
            `${settings.storeName} Confirmation #${newOrder._id}`,
            htmlContent,
            // `<div><h3>Hi ${req.body.user.firstName}!</h3><p>Thank you for your order from Designprintnyc. Once your package ships we will send you a tracking number.You can check the status of your order by <a href="https://designprintnyc.com/login">logging into your account</a>.If you have questions about your order,you can email us at info@designprintnyc.com</p></div>`,
            attachments
          );
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
            );
            console.log(
              "Error message: " +
                response.getTransactionResponse().getErrors().getError()[0].getErrorText()
            );
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response.getTransactionResponse().getErrors().getError()[0].getErrorCode()
          );
          console.log(
            "Error message: " +
              response.getTransactionResponse().getErrors().getError()[0].getErrorText()
          );
        } else {
          console.log("Error Code: " + response.getMessages().getMessage()[0].getCode());
          console.log("Error message: " + response.getMessages().getMessage()[0].getText());
        }
      }
    } else {
      console.log("Null Response.");
    }

    res.send(response);
    // callback(response);
  });
});

module.exports = router;
