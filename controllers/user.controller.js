const User = require("../models/user.model");
const bcrypt = require("bcrypt");
// Get a user by ID

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    // delete user.password;
    let updatedUser = { ...user };
    delete updatedUser.password;
    // console.log("user", us);
    res.json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.body.isPasswordChange) {
      const { oldPassword, newPassword } = req.body;
      // const isPasswordValid = await user.comparePassword(oldPassword);

      if (oldPassword === newPassword) {
        return res.status(400).json({ message: "Old password and new password can't be same" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid old password" });
      }
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update the user's password in the database
      user.password = hashedPassword;
    }

    const { firstName, lastName, company } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.company = company;

    await user.save();

    let updatedUser = { ...user };
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const addFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { favoriteProductId } = req.body;
    user.favorites = [...user?.favorites, favoriteProductId];
    await user.save();
    delete user.password;
    res.json({ status: "success", data: user });
  } catch (err) {
    console.error(err);
    next(err)
  }
};

const removeFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { favoriteProductId } = req.body;
    user.favorites = user?.favorites.filter((el) => el !== favoriteProductId);

    await user.save();
    delete user.password;
    res.json({ status: "success", data: user });
  } catch (err) {
    console.error(error);
    next(error)
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ status: "failed", message: "No users found" });
    }
    res.json({ status: "success", data: users });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateRewardPoints = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { rewardPoints } = req.body;
    user.rewardPoints = rewardPoints;
    await user.save();
    delete user.password;
    res.json({ status: "success", data: user });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// This API is using for admin protal for customer search based on email address

const getUserByEmailAddress = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // delete user.password;
    let updatedUser = { ...user };
    delete updatedUser.password;
    // console.log("user", us);
    res.json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  getUserById,
  updateUser,
  getAllUsers,
  updateRewardPoints,
  addFavorites,
  removeFavorites,
  getUserByEmailAddress,
};
