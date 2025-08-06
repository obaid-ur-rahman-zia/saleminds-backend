// routes/groupCategories.route.js
const {
  createGroupCategory,
  getAllGroupCategories,
  getGroupCategoryById,
  updateGroupCategoryById,
  deleteGroupCategoryById,
} = require("../controllers/groupCategory.controller");
const verifyTokenMiddleware = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { v4: uuidv4 } = require('uuid');

const check_auth = require("../middlewares/check_auth")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/images/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const randomBasename = uuidv4(); // Generate a random UUID
    cb(null, `${randomBasename}${extname}`);
  },
});

const upload = multer({ storage });

// Create a new group category
router.post("/", upload.any("image"),check_auth, createGroupCategory);

// Get all group categories
router.get("/", getAllGroupCategories);

// Get a specific group category by ID
router.get("/:id", getGroupCategoryById);

// Update a group category by ID
router.put("/update/:id", upload.any("newImage"),check_auth, updateGroupCategoryById);

// Delete a group category by ID
router.delete("/:id",check_auth, deleteGroupCategoryById);

module.exports = router;
