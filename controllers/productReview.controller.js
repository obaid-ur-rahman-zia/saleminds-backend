const ProductReview = require("../models/productReview.model");

const { createLog } = require("./log.controller");

const getReviews = async (req, res, next) => {
  try {
    const reviews = await ProductReview.find({ status: "active" })
      .populate("productId")
      .populate("userId");
    res.json(reviews);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createReview = async (req, res, next) => {
  try {
    const newReview = new ProductReview({
      ...req.body,
      status: "pending",
    });

    const savedReview = await newReview.save();
    await createLog("Someone posted a review");
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getReviewsByUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const reviewsByUser = await ProductReview.find({ userId })
      .populate("productId")
      .populate("userId");
    res.json(reviewsByUser);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getReviewsByProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const reviewsByProduct = await ProductReview.find({ productId, status: "active" })
      .populate("productId")
      .populate("userId");
    res.json(reviewsByProduct);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteReview = async (req, res, next) => {
  const userId = req.body.userId;
  const reviewId = req.params.reviewId;

  try {
    const deletedReview = await ProductReview.deleteOne({ _id: reviewId, userId });

    if (deletedReview.deletedCount === 1) {
      res.json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const editReview = async (req, res, next) => {
  try {
    // edit product
    const updatedReview = await ProductReview.findByIdAndUpdate(
      req.params.reviewId,
      {
        ...req.body.review,
        productId: req.body.review.productId._id,
      },
      { new: true }
    );

    if (updatedReview) {
      res.json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllReviewsForAdmin = async (req, res, next) => {
  try {
    const reviews = await ProductReview.find().populate("productId").populate("userId").exec();
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    await ProductReview.findByIdAndUpdate(
      req.params.reviewId,
      {
        status: req.body.status,
      },
      { new: true }
    );
    res.status(200).json({ status: "success", message: "Review Status Updated Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteReviewByAdmin = async (req, res, next) => {
  try {
    const deletedReview = await ProductReview.deleteOne({ _id: req.params.reviewId });

    if (deletedReview.deletedCount === 1) {
      res.json({ status: "success", message: "Review deleted successfully" });
    } else {
      res.status(404).json({ status: "failed", message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateReview = async (req, res, next) => {
  try {
    const updatedReview = await ProductReview.findByIdAndUpdate({
      _id: req.params.reviewId,
    }, {
      ...req.body,
    }, {
      new: true,
    });
    if (updatedReview) {
      res.status(200).json({ status: "success", message: "Review updated successfully" });
    }
    else {
      res.status(404).json({ status: "failed", message: "Review not found" });
    }
  }
  catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = {
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
};
