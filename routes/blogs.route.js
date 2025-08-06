const express = require("express");
const router = express.Router();
const { createNewBlog, deleteBlog, getDetailOfBlogById, listAllBlogs, updateBlog, updateStatusOfBlog, getAllBlogs } = require("../controllers/blog.controller")

const check_auth = require("../middlewares/check_auth");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/images/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extname = path.extname(file.originalname);
        cb(null, uniqueSuffix + extname);
    },
});
const upload = multer({ storage });

router.post("/create", upload.any("image"), check_auth, createNewBlog)

router.get("/list", getAllBlogs)

router.get("/list/all", listAllBlogs)

router.get("/detail/:id", getDetailOfBlogById)

router.delete("/delete/:id", check_auth, deleteBlog)

router.post("/update", check_auth, updateBlog)

router.post("/status/update/:id", check_auth, updateStatusOfBlog)


module.exports = router;