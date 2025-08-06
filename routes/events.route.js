const express = require("express");
const Events = require("../models/events.model");
const newsletterSubscribedUsersModel = require("../models/newsletterSubscribedUsers.model");
const { virginMaryChurchNewsLetter, eventSubscribeTemplate } = require("../commons/emailTemplates");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();
const Settings = require ('../models/settings.model');
router.post("/subscribe", async (req, res, next) => {
  try {
    const getExistingUser = await Events.findOne({
      emailAddress: req.body.emailAddress,
      eventId: req.body.eventId,
    });

    if (getExistingUser) {
      return res.status(400).json({
        status: "failed",
        message: "You have already subscribed to our Offer!",
      });
    }
    // subscribe newsletter
    const newNewsletterSubscribedUsers = new newsletterSubscribedUsersModel({
      ...req.body,
      email: req.body.emailAddress,
    });

    // save form data to database
    const subscription = new Events(req.body);
    const settings = Settings.findOne();

    // send email to custom
    const result = await sendEmail(
      req.body.emailAddress,
      `${req.body.eventName}: ${settings.storeName}`,
      eventSubscribeTemplate(req.body.lastName)
    );

    await subscription.save();
    await newNewsletterSubscribedUsers.save();
    res.status(200).json({
      message: "An email have been sent to your mail",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/list", async (req, res, next) => {
  try {
    const allSubscribedUsers = await Events.find().populate("eventId").exec();

    res.status(200).json({ data: allSubscribedUsers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
