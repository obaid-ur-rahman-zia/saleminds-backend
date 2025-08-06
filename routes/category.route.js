// routes/categories.js
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategoriesForClientTemplate,
  getAllCategoriesDetails,
  getAllCategoriesList,
} = require("../controllers/category.controller");
const verifyTokenMiddleware = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

const check_auth = require("../middlewares/check_auth");

const multer = require("multer");
const path = require("path");

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
// Create a new category

router.post("/", upload.any("images"), check_auth, createCategory);

// Get all categories
router.get("/", getAllCategories);

router.get("/client", getAllCategoriesForClientTemplate);

// Get a specific category by ID
router.get("/:id", getCategoryById);

// Update a category by ID
router.post("/update/:id", upload.any("images"), check_auth, updateCategoryById);

// Delete a category by ID
router.delete("/:id", check_auth, deleteCategoryById);

router.get("/list/all", getAllCategoriesList)

module.exports = router;
