const express = require("express");
const router = express.Router(); // Import your Mongoose model
const {
  getReviews,
  createReview,
  getReviewsByUser,
  getReviewsByProduct,
  deleteReview,
  editReview,
  getAllReviewsForAdmin,
  updateReviewStatus,
  deleteReviewByAdmin,
  updateReview
} = require("../controllers/productReview.controller");

// Route to get all product reviews
router.get("/", getReviews);

// Route to create a new product review
router.post("/", createReview);

// Route to get reviews by userID
router.get("/user/:userId", getReviewsByUser);

// Route to get reviews by productID
router.get("/product/:productId", getReviewsByProduct);

router.delete("/user/:reviewId", deleteReview);

router.patch("/:reviewId", editReview);

router.get("/getAllReviewsForAdmin", getAllReviewsForAdmin);

router.put("/updateReviewStatus/:reviewId", updateReviewStatus);

router.delete("/deleteReviewByAdmin/:reviewId", deleteReviewByAdmin);

router.post("/updateReview/:reviewId", updateReview);

module.exports = router;
