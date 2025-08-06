const BugReport = require("../models/bugreport.model");

const createReport = async (req, res, next) => {
  const report = new BugReport({
    message: req.body.message,
    contact: req.body.contact,
  });
  try {
    await report.save();
    res.status(200).json({
      message: "Bug report submitted successfully",
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createReport,
};
