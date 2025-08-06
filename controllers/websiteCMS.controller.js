const CustomProductGroups = require("../models/customProductGroups");
const Product = require("../models/product.model");

const createNewCustomGroup = async (req, res, next) => {
  try {
    const { name, description, products, isBestSerice } = req.body;

    // check if custom group already exists
    const customGroupExists = await CustomProductGroups.find({ name: name });

    if (!customGroupExists) {
      return res.status(400).json({ status: "failed", message: "Custom group already exists!" });
    }

    const newCustomGroup = new CustomProductGroups({
      name,
      description,
      products,
      isBestSerice
    });

    await newCustomGroup.save();

    res.status(200).json({ status: "success", message: "Custom group created successfully!" });
  } catch (err) {
    console.error(err);
    next(err)
  }
};

const getAllCustomGroupsForAdmin = async (req, res, next) => {
  try {
    const customGroups = await CustomProductGroups.find()
      .populate("products")
      .exec();

    res.status(200).json({
      status: "success",
      message: "Custom groups fetched successfully!",
      data: customGroups,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const getAllCustomGroups = async (req, res, next) => {
  try {
    const customGroups = await CustomProductGroups.find({ isBestSerice: false })
      .populate("products")
      .exec();

    res.status(200).json({
      status: "success",
      message: "Custom groups fetched successfully!",
      data: customGroups,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getBestServiceProducts = async (req, res, next) => {
  try {
    const customGroups = await CustomProductGroups.find({ isBestSerice: true })

      .populate("products")
      .exec();

    res.status(200).json({
      status: "success",
      message: "Custom groups fetched successfully!",
      data: customGroups,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getCustomGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customGroup = await CustomProductGroups.findById({ _id: id });

    if (!customGroup) {
      return res.status(400).json({ status: "failed", message: "Custom group not found!" });
    }

    // i just want to return product name and id and put as optionId and optionName do this
    const allProducts = await Product.find(
      { _id: { $in: customGroup.products } },
      { name: 1, _id: 1 }
    );

    customGroup.products = allProducts;

    res.status(200).json({
      status: "success",
      message: "Custom group fetched successfully!",
      data: customGroup,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteCustomGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customGroup = await CustomProductGroups.findByIdAndDelete({ _id: id });

    if (!customGroup) {
      return res.status(400).json({ status: "failed", message: "Custom group not found!" });
    }

    res.status(200).json({ status: "success", message: "Custom group deleted successfully!" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateCustomGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, products } = req.body;
    // Validate input data
    if (!name || !description || !products) {
      return res.status(400).json({ status: "failed", message: "Missing required fields." });
    }

    const updatedGroup = await CustomProductGroups.findOneAndUpdate(
      { _id: id },
      { $set: { name, description, products } },
      { new: true } // Options: Return the modified document, and run schema validations
    );

    if (!updatedGroup) {
      return res.status(404).json({ status: "failed", message: "Custom group not found." });
    }
    res.status(200).json({
      status: "success",
      message: "Custom group updated successfully!",
      data: updatedGroup,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createNewCustomGroup,
  getAllCustomGroups,
  deleteCustomGroup,
  updateCustomGroup,
  getCustomGroupById,
  getBestServiceProducts,
  getAllCustomGroupsForAdmin
};
