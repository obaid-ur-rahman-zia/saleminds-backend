const express = require("express");

const {
  getAllOrders,
  createNewOrder,
  getAllOrderByUserId,
  trackOrder,
  getOrderByID,
  updateOrderStatus,
  updateOrder,
  addTrackingNumber,
  markOrderAsArcheive,
  getGenrateOrderInvoicePDF,
  genrateOrderInvoiceInPDF,
  getArchivedOrderByUserId,
  addNewOrderStatus,
  editOrderStatus,
  deleteOrderStatus,
  fetchOrderStatus,
  orderList,
  uploadAndGenrateURL,
  addNewOrderNotes,
  fetchAOrderNotes,
  genrateAndSendOrderInvoiceInPDF,
} = require("../controllers/order.controller");

const check_auth = require("../middlewares/check_auth");

const router = express.Router();

const multer = require("multer");
const path = require("path");
const verifyTokenMiddleware = require("../middlewares/auth");

const singleAttachment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/orderNotes/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadSingleFile = multer({ storage: singleAttachment });

// Route to get all orders
router.get("/", getAllOrders);

// Route to create a new order
router.post("/", createNewOrder);

// Route to get all orders by user id
router.get("/:userId", getAllOrderByUserId);

router.get("/archived-orders/:userId", getArchivedOrderByUserId);

router.get("/track/:orderId", trackOrder);

router.get("/orderDetail/:orderId", getOrderByID);

router.put("/updateStatus/:orderId", check_auth, updateOrderStatus);

router.put("/updateOrder/:orderId", check_auth, updateOrder);

router.put("/addTrackingNumber/:orderId", check_auth, addTrackingNumber);

router.put("/markOrderAsArcheive/:orderId", check_auth, markOrderAsArcheive);

router.post("/genrateInvoice/:orderId", genrateOrderInvoiceInPDF);

router.get("/fetchInvoiceReport/:orderId", getGenrateOrderInvoicePDF);

router.post("/orderStatus/add", check_auth, addNewOrderStatus);

router.post("/orderStatus/edit", check_auth, editOrderStatus);

router.delete("/orderStatus/delete/:statusId", check_auth, deleteOrderStatus);

router.get("/orderStatus/list", check_auth, fetchOrderStatus);

router.post("/list/all/", check_auth, orderList);

router.post("/orderNote-attachment/upload", uploadSingleFile.single("image"), uploadAndGenrateURL);

router.post("/orderNote/add", check_auth, addNewOrderNotes);

router.post("/orderNote/client/add", verifyTokenMiddleware, addNewOrderNotes);

router.post("/orderNote/get/:orderId", fetchAOrderNotes);

router.post("/fetch-invoice", check_auth, genrateAndSendOrderInvoiceInPDF)

// router.post("/export/",check_auth,prepareDataForExport)

module.exports = router;
