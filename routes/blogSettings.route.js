const express = require("express");
const router = express.Router();
const {
  getBlogSettings,
  updateBlogSettings,
} = require("../controllers/blogSettings.controller");
const check_auth = require("../middlewares/check_auth");

const multer = require("multer");
const path = require("path");

const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/blogs/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const randomBasename = uuidv4(); // Generate a random UUID
    cb(null, `${randomBasename}${extname}`);
  },
});

const upload = multer({ storage });

router.get("/", getBlogSettings);
router.put("/", check_auth, upload.single("image"), updateBlogSettings);

module.exports = router;
