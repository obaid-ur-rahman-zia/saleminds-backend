const ShippingMethod = require("../models/shippingMethods.model");

const getShippingMethods = async (req, res, next) => {
  try {
    const shippingMethods = await ShippingMethod.find();
    res.json(shippingMethods);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getSingleShippingMethod = async (req, res, next) => {
  try {
    const shippingMethod = await ShippingMethod.findById(req.params.id);
    if (!shippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }
    res.json(shippingMethod);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createShippingMethod = async (req, res, next) => {
  try {
    const newShippingMethod = new ShippingMethod(req.body);
    const savedShippingMethod = await newShippingMethod.save();
    res.status(201).json(savedShippingMethod);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateShippingMethod = async (req, res, next) => {
  try {
    const updatedShippingMethod = await ShippingMethod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedShippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }
    res.json(updatedShippingMethod);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteShippingMethod = async (req, res, next) => {
  try {
    const deletedShippingMethod = await ShippingMethod.findByIdAndDelete(req.params.id);
    if (!deletedShippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }
    res.json({ message: "Shipping method deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  getShippingMethods,
  getSingleShippingMethod,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
};
