const express = require("express");
const {
  getOffers,
  createOffer,
  getOfferByActiveStatus,
  updateStatusOfOffer,
  deleteOffer,
  updateOfferDetail
} = require("../controllers/offer.controller");
const router = express.Router(); // Import your Mongoose model

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

router.get("/", getOffers);

router.post("/",upload.any('image'),createOffer);

router.get("/active", getOfferByActiveStatus);

router.put("/updateStatus/:id", updateStatusOfOffer)

router.delete("/:id", deleteOffer)

router.put("/updateOfferDetail/:id", upload.any('newImage'), updateOfferDetail)

module.exports = router;
