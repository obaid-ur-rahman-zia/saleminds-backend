const ProductOption = require("../../models/product/productOption.model");
const ProductOptionValue = require("../../models/product/productOptionValue.model");

const createProductOption = async (req, res, next) => {
  try {
    const { name } = req.body;
    // Check if product option already exists
    const alreadyExist = await ProductOption.find({ name: name });
    if (alreadyExist.length > 0) {
      return res.status(400).json({ status: "failed", message: "Product Option already exists" });
    }
    const newProductOption = await new ProductOption({ name }).save();
    res.status(201).json({ status: "success", message: "New Product Option added Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createProductOptionsBulk = async (req, res, next) => {
  try {
    const newProductOptions = await ProductOption.create(req.body);
    res.status(201).json(newProductOptions);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllProductOption = async (req, res, next) => {
  try {
    const productOptions = await ProductOption.find();
    if (!productOptions) {
      return res.status(404).json({ status: "failed", error: "Product Option not found" });
    }
    res.status(200).json({ status: "success", data: productOptions });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteProductOption = async (req, res, next) => {
  const { id } = req.params;
  // check in all products if this product is used in productOptions
  // try {
  //   const products = await Product.find({ options: id });
  //   if (products.length > 0) {
  //     return res.status(400).json({ status: "failed", message: "This Product Option is used in some products, can't delete it." });
  //   }
  //   const productOption = await ProductOption.findByIdAndDelete(id);
  //   if (!productOption) {
  //     return res.status(404).json({ status: "failed", error: "Product Option not found" });
  //   }
  //   res.status(200).json({ status: "success", data: productOption });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ status: "failed", error: "Internal Server Error" });
  // }
  try {
    const productOption = await ProductOption.findByIdAndDelete(id);
    if (!productOption) {
      return res.status(404).json({ status: "failed", error: "Product Option not found" });
    }
    res.status(200).json({ status: "success", data: productOption });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const editNameOfProductOption = async (req, res, next) => {
  const { newName } = req.body;

  console.log("Id: ", req.params.id)
  console.log("Name: ", newName)

  try {
    const productOption = await ProductOption.findByIdAndUpdate(req.params.id, { name: newName }, { new: true });
    if (!productOption) {
      return res.status(404).json({ status: "failed", error: "Product Option not found" });
    }
    res.status(200).json({ message: "Renamed Successfully." });
  }
  catch (error) {
    console.error(error);
    next(error)
  }

}

module.exports = { createProductOption, createProductOptionsBulk, getAllProductOption, deleteProductOption, editNameOfProductOption };