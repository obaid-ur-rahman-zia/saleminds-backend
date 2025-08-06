const UrlModel = require("../models/url.model");
const { createLog } = require("./log.controller");

// Create a new redirection
const createNewUrl = async (req, res, next) => {
  try {
    const checkIfSameUrlAlreadyRegistered = await UrlModel.findOne({
      oldUrl: req.body.oldUrl,
    });

    if (checkIfSameUrlAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "Url Redirection already exists." });
    }

    const newUrl = await new UrlModel({
      title: req.body.title,
      oldUrl: req.body.oldUrl,
      newUrl: req.body.newUrl,
      description: req.body.description,
    }).save();

    await createLog(
      `New Url Redirection is created with title '${newUrl.title}' by ${req.user.name}`
    );

    res.status(200).json({ message: "Url Redirection created successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Delete URL Redirection
const deleteUrl = async (req, res, next) => {
  try {
    const url = await UrlModel.findByIdAndDelete(req.params.id);

    if (!url) {
      return res.status(404).json({ message: "Url not found." });
    }

    await createLog(
      "Url Redirection titled as " +
      url.title +
      " by " +
      req.user.name +
      " has been deleted"
    );
    res.status(200).json({ message: "Url Redirection deleted successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Update Url Redirection
const updateUrl = async (req, res, next) => {
  try {
    const alreadyExists = await UrlModel.findById({ _id: req.params.id });

    if (!alreadyExists) {
      return res.status(400).json({ message: "Url Redirection not found" });
    } else {
      const url = await UrlModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          title: req.body.title,
          oldUrl: req.body.oldUrl,
          newUrl: req.body.newUrl,
          description: req.body.description,
        },
        { new: true }
      );
      if (!url) {
        return res.status(400).json({ message: "Url Redirection not found" });
      }
      await createLog(
        "Updated Url Redirection named as " + url.title + " by " + req.user.name
      );
      res
        .status(200)
        .json({ message: "Url Redirection Updated Successfully." });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// List All Url Redirections
const listAllUrls = async (req, res, next) => {
  try {
    const urls = await UrlModel.find({});
    if (!urls) {
      return res.status(400).json({ message: "No Url Redirections found" });
    }
    res.status(200).json({ data: urls });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllUrls = async (req, res, next) => {
  try {
    const urls = await UrlModel.find({ status: true });
    res.status(200).json(urls);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Update Url Redirection status
const updateUrlStatus = async (req, res, next) => {
  try {
    const url = await UrlModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ message: "Url Redirection not found." });
    }

    await createLog(
      "Url Redirection titled as " +
      url.title +
      " by " +
      req.user.name +
      " status has been updated to " +
      req.body.status
    );
    res
      .status(200)
      .json({ message: "Url Redirection status updated successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Get Details of URL Redirection
const getDetailOfUrlById = async (req, res, next) => {
  try {
    const urlDetail = await UrlModel.findById({ _id: req.params.id });

    if (!urlDetail) {
      return res
        .status(404)
        .json({ status: "failed", error: "Url Redirection not found" });
    }
    res.json({ data: urlDetail });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createNewUrl,
  deleteUrl,
  updateUrl,
  getAllUrls,
  listAllUrls,
  updateUrlStatus,
  getDetailOfUrlById,
};
