const Quote = require("../models/quote.model");
const CustomQuote = require("../models/customQuote.model");
const sendEmail = require("../utils/sendEmail");
const email = require("../models/email.model");
const { createLog } = require("./log.controller");
const {sendQuoteEmailTemplate, sendCustomOrderRequestEmail, sendQuoteUpdateCommentEmail} = require("../commons/emailTemplates");
const Settings = require('../models/settings.model');

const createQuote = async (req, res, next) => {
  try {
    // check if quote with the same title already exists

    const existingQuote = await Quote.findOne({ title: req.body.title });

    if (existingQuote) {
      return res.status(400).json({ message: "Quote already exists!" });
    }

    const quote = new Quote(req.body);

    await quote.save();
    res.status(200).send({
      message: "Quote created successfully",
    });

    const settings = await Settings.findOne();
    const quoteParams = req.body;

    const htmlContent = sendQuoteEmailTemplate(quoteParams, settings);
    const result = await sendEmail(req.body.email, req.body.title, htmlContent);

    
    newEmailSent = new email({
      receiver: req.body.email,
      subject: req.body.title,
      message: htmlContent,
      sendingStatus: result.success,
    });

    await newEmailSent.save();
  } catch (error) {
    console.error(error);
    next(error)
  }
};


const createNewCustomQuote = async (req, res, next) => {

  try {

    const newCustomQuote = new CustomQuote({
      email: req.body.email,
      firstName: req.body.firstName,
      phoneNumber: req.body.phoneNumber,
      details: req.body.details,
      attachmentURL: req.body.attachmentURL,
    });

    await newCustomQuote.save();
    res.status(200).send({
      message: "Custom Quote created successfully",
    });

    const settings = await Settings.findOne();
    const customQuoteParams = req.body;
    const htmlContent = sendCustomOrderRequestEmail(customQuoteParams, settings);
    const result = await sendEmail(req.body.email, "New Quote Added", htmlContent);

     newEmailSent = new email({
      receiver: req.body.email,
      subject: "New Quote Added",
      message: htmlContent,
      sendingStatus: result.success,
    });

    await newEmailSent.save();
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const fetchAllCustomQuotes = async (req, res, next) => {
  try {
    const customQuotes = await CustomQuote.find();
    res.status(200).json({
      data: customQuotes,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const fetchDetailOfCustomQuote = async (req, res, next) => {
  try {
    const customQuote = await CustomQuote.findOne({ _id: req.params.id });
    res.status(200).json({
      data: customQuote,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const deleteCustomQuoteByID = async (req, res, next) => {
  try {
    const customQuote = await CustomQuote.findOneAndDelete({
      _id: req.params.id,
    });

    if (!customQuote) {
      return res.status(400).json({ message: "Custom Quote not found" });
    } else {
      await createLog("Custom Quote deleted by " + req.user.name);

      res.status(200).json({ message: "Custom Quote deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json({
      data: quotes,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getQuoteByID = async (req, res, next) => {
  try {
    const quote = await Quote.find({
      _id: req.params.quoteId,
    });

    res.status(200).send({
      data: quote,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteQuoteByID = async (req, res, next) => {
  try {
    const quote = await Quote.findOneAndDelete({
      _id: req.body.quoteId,
    });

    if (!quote) {
      return res.status(400).json({ message: "Quote not found" });
    } else {
      await createLog("Quote deleted " + quote.title + " by " + req.user.name);

      res.status(200).json({ message: "Quote deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateQuoteByID = async (req, res, next) => {
  console.log(req.body);

  try {
    const quote = await Quote.findByIdAndUpdate(
      {
        _id: req.body.quoteId,
      },
      {
        status: req.body.status,
        comments: req.body.anyComment,
      },
      { new: true }
    );

    if (!quote) {
      return res.status(400).json({ message: "Quote not found" });
    } else {
      await createLog("Quote Status Updated for title " + req.body.title + " by " + req.user.name);
      const settings = await Settings.findOne();
      const htmlContent = sendQuoteUpdateCommentEmail(quote, settings);
      await sendEmail(quote.email, "Quote Status Updated", htmlContent);
      res.status(200).json({ message: "Quote status updated successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteByID,
  deleteQuoteByID,
  updateQuoteByID,
  createNewCustomQuote,
  fetchAllCustomQuotes,
  fetchDetailOfCustomQuote,
  deleteCustomQuoteByID
};
