const CustomEstimate = require("../models/customEstimate.model");
const dayjs = require("dayjs");
const { generateCustomEstimateId } = require("../utils/helpers");

exports.uploadEstimateImage = (req, res, next) => {
  try {
    // Return the path of the uploaded file
    const imagePath = `${req.file.destination}${req.file.filename}`;
    res.status(200).json({ path: imagePath });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Get all estimates for a specific user by userId
exports.getAllEstimatesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const estimates = await CustomEstimate.find({ userId });
    res.status(200).json(estimates);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

exports.getSingleEstimatesByUserId = async (req, res, next) => {
  const { userId, estimateId } = req.params;

  try {
    const estimates = await CustomEstimate.find({ userId, _id: estimateId });
    res.status(200).json(estimates[0]);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Get a single estimate by _id or filter by start and end dates
exports.getEstimateByUserIdAndIdOrDateRange = async (req, res, next) => {
  const { userId } = req.params;
  const { startDate, endDate, estimateId, status } = req.body;

  try {
    // Build the query object
    let query = { userId };

    // If estimateId is provided, add it to the query
    if (estimateId) {
      query._id = estimateId;
    }

    // If status is provided, add it to the query
    if (status) {
      query.status = status;
    }

    // If startDate and endDate are provided, add the date range filter to the query
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf("day").toDate();
      const end = dayjs(endDate).endOf("day").toDate();
      query.submittedDate = {
        $gte: start,
        $lte: end,
      };
    }

    // Execute the query
    const estimates = await CustomEstimate.find(query);

    // Check if no estimates are found
    if (!estimates || estimates.length === 0) {
      return res.status(404).json({ message: "No estimates found" });
    }

    res.status(200).json(estimates);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Create a new custom estimate
exports.createEstimate = async (req, res, next) => {
  try {
    const data = {
      _id: await generateCustomEstimateId(),
      ...req.body,
    };
    const newEstimate = new CustomEstimate(data);
    await newEstimate.save();
    res.status(201).json(newEstimate);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Update an existing estimate by ID
exports.updateEstimate = async (req, res, next) => {
  const { estimateId } = req.params;

  try {
    const updatedEstimate = await CustomEstimate.findByIdAndUpdate(estimateId, req.body, {
      new: true,
    });

    if (!updatedEstimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    res.status(200).json(updatedEstimate);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// Delete an estimate by ID
exports.deleteEstimate = async (req, res, next) => {
  const { estimateId } = req.params;

  try {
    const deletedEstimate = await CustomEstimate.findByIdAndDelete(estimateId);

    if (!deletedEstimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    res.status(200).json({ message: "Estimate deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};


exports.getAllCustomEstimates = async (req, res, next) => {
  try {
    const estimates = await CustomEstimate.find();

    // Check if no estimates are found
    if (!estimates || estimates.length === 0) {
      return res.status(404).json({ message: "No estimates found", data: [] });
    }

    // Filter the estimates data
    let filteredEstimates = estimates.map((estimate) => ({
      _id: estimate._id,
      productName: estimate.product?.name, // Optional chaining in case product is undefined
      projectName: estimate.projectName,
      status: estimate.status,
      submittedDate: estimate.submittedDate
    }));

    // Send the filtered estimates
    res.status(200).json(filteredEstimates);
  } catch (error) {
    console.error(error);
    next(error)
  }
};


exports.getCustomEstimateDetails = async (req, res, next) => {
  try {

    const { estimateId } = req.params;

    const estimate = await CustomEstimate.findById(estimateId)

    // Check if estimate is found

    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found", data: null });
    }

    // Filter the estimates data

    return res.status(200).json({ estimate })

  }
  catch (error) {
    console.error(error);
    next(error)
  }
}

exports.updateCustomDetailForAdminSide = async (req, res, next) => {
  try {

    const { estimateId } = req.params;

    const updatedEstimate = await CustomEstimate.findByIdAndUpdate(estimateId,
      {
        status: req.body.status,
        agentComments: req.body.agentComments,
        additionalNotes: req.body.additionalNotes,
        unitSetPrice: req.body.unitSetPrice
      }
      , {
        new: true,
      });

    // Check if estimate is found

    if (!updatedEstimate) {
      return res.status(404).json({ message: "Estimate not found", data: null });
    }

    // Filter the estimates data

    return res.status(200).json({ message: "Data updated." })

  }
  catch (error) {
    console.error(error);
    next(error)
  }
}