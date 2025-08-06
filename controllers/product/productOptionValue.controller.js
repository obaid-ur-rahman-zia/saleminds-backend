const ProductOptionValue = require("../../models/product/productOptionValue.model");

const createProductOptionValue = async (req, res, next) => {
  try {
    const { name } = req.body;
    // Check if product option value already exists
    const alreadyExist = await ProductOptionValue.findOne({ name: name });
    if (alreadyExist) {
      return res.status(400).json({ status: "failed", message: "Product Option Value already exists" });
    }
    const newProductOptionValue = new ProductOptionValue({ name });
    await newProductOptionValue.save();
    res.status(201).json({ status: "success", message: "New Product Option Value Added Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};


const createProductOptionValuesBulk = async (req, res, next) => {
  try {
    const newProductOptionValue = await ProductOptionValue.create(req.body);
    // const savedProductOptionValue = await newProductOptionValue.save();
    res.status(201).json(newProductOptionValue);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllProductOptionValues = async (req, res, next) => {
  try {
    const productOptionValues = await ProductOptionValue.find();
    if (!productOptionValues) {
      return res.status(404).json({ status: "failed", error: "Product Option Value not found" });
    }
    res.status(200).json({ status: "success", data: productOptionValues });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteProductOptionValue = async (req, res, next) => {
  const { id } = req.params;
  try {
    const productOptionValue = await ProductOptionValue.findByIdAndDelete(id);
    if (!productOptionValue) {
      return res.status(404).json({ status: "failed", error: "Product Option Value not found" });
    }
    res.status(200).json({ status: "success", data: productOptionValue });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const editNameOfProductOptionValue = async (req, res, next) => {
  const { newName } = req.body;
  try {
    const productOptionValue = await ProductOptionValue.findByIdAndUpdate(req.params.id, { name: newName }, { new: true });
    if (!productOptionValue) {
      return res.status(404).json({ status: "failed", error: "Product Option Value not found" });
    }
    res.status(200).json({ message: "Renamed Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
}



module.exports = {
  createProductOptionValue,
  getAllProductOptionValues,
  createProductOptionValuesBulk,
  deleteProductOptionValue,
  editNameOfProductOptionValue
};
