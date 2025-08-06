const dayjs = require("dayjs");
const Voucher = require("../models/voucher.model");
const userModel = require("../models/user.model");

const createVoucher = async (req, res, next) => {
  try {
    const voucher = new Voucher(req.body);
    await voucher.save();
    res.status(201).send({
      status: "success",
      message: "Voucher created successfully",
      data: voucher,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find({});
    res.status(200).send({
      status: "success",
      data: vouchers,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) {
      return res.status(404).send({ message: "Voucher not found" });
    }
    res.status(200).send({
      status: "success",
      message: "Voucher deleted successfully",
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!voucher) {
      return res.status(404).send({ message: "Voucher not found" });
    }

    res.status(200).send({
      status: "success",
      message: "Voucher updated successfully",
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const checkVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findOne({ code: req.body.voucherCode });
    console.log(voucher);

    if (!voucher) {
      return res.status(404).send({ message: "Voucher not found" });
    }

    if (voucher.selectedCustomers.length > 0) {
      const user = await userModel.findById(req.user._id);
      if (!voucher.selectedCustomers.includes(user.email)) {
        return res.status(401).send({ message: "The voucher cannot be applied" });
      }
    }

    if (voucher.isExpired) {
      return res.status(401).send({ message: "Entered Voucher has been expired !" });
    } else {
      if (!voucher.isSingle) {
        // res.status(200).json({
        //   data: voucher,
        // });
        const currentDate = dayjs();

        const startDate = dayjs(voucher.validityDates[0]);
        const endDate = dayjs(voucher.validityDates[1]);

        if (currentDate.isBefore(endDate) && currentDate.isAfter(startDate)) {
          return res.status(200).json({
            data: voucher,
          });
        } else {
          return res.status(401).send({
            message: `Entered Voucher is valid between ${startDate} to ${endDate}`,
          });
        }
      } else {
        return res.status(200).json({
          data: voucher,
        });
      }
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const applyIsExpiredToVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find({ _id: req.params.id });

    if (!vouchers) {
      return res.status(404).send({ message: "Voucher not found" });
    }

    await Voucher.findByIdAndUpdate(req.params.id, { isExpired: true });

    res.status(200).send({
      status: "success",
      message: "Status updated successfully for the voucher",
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createVoucher,
  getVouchers,
  deleteVoucher,
  checkVoucher,
  updateVoucher,
  applyIsExpiredToVouchers,
};
