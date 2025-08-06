// create routes for user

// routes/userRoutes.js

const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateRewardPoints,
  addFavorites,
  removeFavorites,
  //   updateUser,
  //   deleteUser,
} = require("../controllers/user.controller");
const verifyTokenMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/add-to-favorites/:id", addFavorites);

router.post("/remove-from-favorites/:id", removeFavorites);

// Route to get a user by ID
router.get("/:id", getUserById);

// Route to get all users
router.get("/", getAllUsers);

// Route to update a user by ID
router.put("/:id", updateUser);

router.put("/update-reward-points/:id", updateRewardPoints);

// // Route to delete a user by ID
// router.delete("/:id", deleteUser);

module.exports = router;
