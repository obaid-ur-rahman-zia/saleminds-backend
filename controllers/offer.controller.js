const Offer = require("../models/offer.model");
const fsPromises = require("fs").promises;

const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find();
    res.json({ status: "success", data: offers });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createOffer = async (req, res, next) => {

  let image = "";

  if (req.files) {
    image = req.files[0].destination + "/" + req.files[0].filename;
  }

  try {

    await Offer.create({
      heading: req.body.heading,
      description: req.body.description,
      link: req.body.url,
      img: image
    });
    res.status(201).json({
      status: "success",
      message: "Offer created successfully"
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getOfferByActiveStatus = async (req, res, next) => {
  try {
    const offer = await Offer.find({ isActive: true });
    res.json(offer);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateStatusOfOffer = async (req, res, next) => {
  try {
    await Offer.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive });
    res.status(400).json({ status: "success", message: "Offer status updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteOffer = async (req, res, next) => {
  try {
    const CheckIfOffer = await Offer.findById(req.params.id);
    if (!CheckIfOffer) return res.status(400).json({ status: "failed", message: "Offer not found" });
    const imageDelete = CheckIfOffer.img;
    // delete the image from the server
    try {
      await fsPromises.access(imageDelete);
      await fsPromises.unlink(imageDelete);
      console.log("File deleted successfully:", imageDelete);
    } catch (error) {
      console.error("Error in deleting file:", imageDelete, error);
    }
    await Offer.findByIdAndDelete(req.params.id);
    res.status(400).json({ status: "success", message: "Offer deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateOfferDetail = async (req, res, next) => {
  let image = "";
  try {
    if (req.body.oldimage) {
      try {
        await fsPromises.access(req.body.oldimage);
        await fsPromises.unlink(req.body.oldimage);
        console.log("File deleted successfully:", req.body.oldimage);
      } catch (error) {
        console.error("Error in deleting file:", req.body.oldimage, error);
      }
      image = req.files[0].destination + "/" + req.files[0].filename;
    }
    else {
      image = req.body.image;
    }
    await Offer.findByIdAndUpdate(req.params.id, {
      heading: req.body.heading,
      description: req.body.description,
      link: req.body.url,
      img: image
    });
    res.status(400).json({ status: "success", message: "Offer updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = {
  getOffers,
  createOffer,
  getOfferByActiveStatus,
  updateStatusOfOffer,
  deleteOffer,
  updateOfferDetail
};
