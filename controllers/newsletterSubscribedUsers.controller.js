const NewsletterSubscribedUsers = require("../models/newsletterSubscribedUsers.model");
const sendEmail = require("../utils/sendEmail");
const email = require("../models/email.model")
const { newsLetterSubscribedEmailTemplate } = require("../commons/emailTemplates");
const Settings = require('../models/settings.model');


const createNewsletterSubscribedUsers = async (req, res) => {
  try {
    const getExistingUser = await NewsletterSubscribedUsers.findOne({
      email: req.body.email,
    });

    if (getExistingUser) {
      return res.status(400).json({
        status: "failed",
        message: "You have already subscribed to our NewsLetter!",
      });
    }
    const newNewsletterSubscribedUsers = new NewsletterSubscribedUsers({
      ...req.body,
    });
    const settings = await Settings.findOne();
    const result = await sendEmail(req.body.email, "Newsletter Subscription Confirmation", newsLetterSubscribedEmailTemplate(req.body.email, settings,));

    const newEmailSent = new email({
      receiver: req.body.email,
      message: newsLetterSubscribedEmailTemplate(),
      subject: "Newsletter Subscribed Successfully.",
      sendingStatus: result.success,
    })

    await newEmailSent.save();

    await newNewsletterSubscribedUsers.save();
    res.status(201).json({
      status: "success",
      message: "You have successfully subscribed to our NewsLetter!"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllNewsletterSubscribedUsers = async (req, res) => {
  try {
    const newsletterSubscribedUsers = await NewsletterSubscribedUsers.find();
    res.status(200).json({ status: "success", data: newsletterSubscribedUsers });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
};


const deleteNewsletterSubscribedUser = async (req, res) => {

  try {
    const newsletterSubscribedUser = await NewsletterSubscribedUsers.findOneAndDelete({
      _id: req.body.id
    });

    if (!newsletterSubscribedUser) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }
    res.status(200).json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
}

module.exports = {
  createNewsletterSubscribedUsers,
  getAllNewsletterSubscribedUsers,
  deleteNewsletterSubscribedUser
};
