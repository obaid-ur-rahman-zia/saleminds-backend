const Address = require("../models/address.model");

const getAllAddressOfUser = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    if (!addresses) {
      return res.status(404).json({ status: "success", message: "Addresses not found" });
    }
    res.json({ status: "success", data: addresses });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createNewAddress = async (req, res, next) => {
  try {
    // console.log("req.params.userId", req.params.userId);
    const presentAddress = await Address.findOne({
      streetAddress: req.body.streetAddress,
      userId: req.params.userId,
    });

    console.log("presentAddress", presentAddress);

    if (presentAddress) {
      return res
        .status(409)
        .send({ message: "Address with same street address is already present" });
    }
    if (req.body.isDefaultBilling) {
      console.log("Setting as default billing");
      const temp = await Address.updateMany(
        { userId: req.params.userId },
        { isDefaultBilling: false }
      );
      console.log(temp);
    }

    if (req.body.isDefaultShipping) {
      console.log("Setting as default shipping");
      await Address.updateMany({ userId: req.params.userId }, { isDefaultShipping: false });
    }
    console.log("here");

    // Use the correct parameter name consistently (use req.params._id or req.params.id, depending on your route configuration)
    const newAddress = await Address.create(req.body);

    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateAddress = async (req, res, next) => {
  try {
    if (req.body.isDefaultBilling) {
      console.log("Setting as default billing");
      const temp = await Address.updateMany(
        { userId: req.body.userId },
        { isDefaultBilling: false }
      );
      console.log(temp);
    }

    if (req.body.isDefaultShipping) {
      console.log("Setting as default shipping");
      await Address.updateMany({ userId: req.body.userId }, { isDefaultShipping: false });
    }

    // Use the correct parameter name consistently (use req.params._id or req.params.id, depending on your route configuration)
    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedAddress);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getDefaultBilling = async (req, res, next) => {
  try {
    const defaultBillingAddress = await Address.findOne({
      userId: req.params.userId,
      isDefaultBilling: true,
    });
    res.json(defaultBillingAddress);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getDefaultShipping = async (req, res, next) => {
  try {
    const defaultShippingAddress = await Address.findOne({
      userId: req.params.userId,
      isDefaultShipping: true,
    });
    res.json(defaultShippingAddress);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  getAllAddressOfUser,
  createNewAddress,
  updateAddress,
  deleteAddress,
  getDefaultBilling,
  getDefaultShipping,
};
