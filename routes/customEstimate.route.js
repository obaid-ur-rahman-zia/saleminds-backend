const express = require("express");
const router = express.Router();
const customEstimateController = require("../controllers/customEstimate.controller");
const multer = require("multer");
const path = require("path");

const verifyTokenMiddleware = require("../middlewares/auth");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.post("/image/upload",verifyTokenMiddleware, upload.single("image"), customEstimateController.uploadEstimateImage);

// Get all estimates for a specific user by userId
router.get("/user/:userId", verifyTokenMiddleware, customEstimateController.getAllEstimatesByUserId);

// Get a single estimate by userId and estimate ID, or filter by date range
router.post("/user/:userId/filters",verifyTokenMiddleware, customEstimateController.getEstimateByUserIdAndIdOrDateRange);

// Create a new estimate
router.post("/", verifyTokenMiddleware, customEstimateController.createEstimate);

// Update an estimate by ID
router.get("/:estimateId/:userId",verifyTokenMiddleware, customEstimateController.getSingleEstimatesByUserId);

// Update an estimate by ID
router.put("/:estimateId",verifyTokenMiddleware, customEstimateController.updateEstimate);

// Delete an estimate by ID
router.delete("/:estimateId",verifyTokenMiddleware, customEstimateController.deleteEstimate);

// fetch all custom estimates
router.get("/all", customEstimateController.getAllCustomEstimates)

// fetch detail of special custom estimates
router.post("/detail/:estimateId", customEstimateController.getCustomEstimateDetails)

// fetch detail of special custom estimates
router.post("/detail/update/:estimateId", customEstimateController.updateCustomDetailForAdminSide)

module.exports = router;
