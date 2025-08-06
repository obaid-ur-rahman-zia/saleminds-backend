const ContactUs = require("../models/contactus.model");
const nodemailer = require("nodemailer");

const { createLog } = require("./log.controller");
const config = require("config");
const sendEmail = require("../utils/sendEmail");

const createContactUs = async (req, res, next) => {
  try {
    const contactUs = await ContactUs.create(req.body);

    // const transporter = nodemailer.createTransport({
    //   host: process.env.HOST,
    //   secure: Boolean(process.env.SECURE),
    //   port: Number(process.env.EMAIL_PORT),
    //   logger: true,
    //   debug: true,
    //   // service: process.env.SERVICE,
    //   auth: {
    //     user: process.env.USER,
    //     pass: process.env.PASS,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });
    const htmlBody = `
      <html>
        <body>
          <h2>Contact Form Submission</h2>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Message:</strong> ${req.body.message}</p>
        </body>
      </html>
    `;

    await sendEmail(config.get("v1.EMAIL_USERNAME"), "Contact Us", htmlBody);
    // await transporter.sendMail({
    //   from: req.body.email,
    //   to: process.env.USER,
    //   subject: "Contact Us",
    //   html: htmlBody,
    // });
    await createLog("Someone pushed the info on contacted us form");
    res.status(201).json(contactUs);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getContactUs = async (req, res, next) => {
  try {
    const contactUs = await ContactUs.find();
    res.status(200).json({ status: "success", data: contactUs });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteContactUsRecord = async (req, res, next) => {
  try {
    const contactUs = await ContactUs.findByIdAndDelete({
      _id: req.body.id,
    });

    res.status(200).json({ status: "success", message: "Deleted Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createContactUs,
  getContactUs,
  deleteContactUsRecord,
};
