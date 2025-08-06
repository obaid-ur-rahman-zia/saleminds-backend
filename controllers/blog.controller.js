const Blogs = require("../models/blogs.model");
const { createLog } = require("./log.controller");

const createNewBlog = async (req, res, next) => {

    try {

        const images = req.files.map((file) => {
            return file.destination + file.filename;
        });

        console.log("Images: ", images)

        const blogImage = images.slice(0, images.length - 1);
        const blogBannerImage = images[images.length - 1];

        console.log("Blog Image: ", blogImage)

        console.log("Blog Banner Image: ", blogBannerImage)

        const alreadyExists = await Blogs.find({ title: req.body.title });

        if (alreadyExists.length > 0) {
            return res.status(400).json({ message: "Blog already exists with this title." });
        }

        let createNewBlogObj = new Blogs({
            title: req.body.title,
            subTitle: req.body.subTitle,
            description: req.body.description,
            bannerImage: blogBannerImage,
            blogImages: blogImage,
            createdBy: req.body.createdBy ?? "Admin"
        });

        createNewBlogObj = await createNewBlogObj.save();

        await createLog("New Blog title as " + req.body.title + " by " + req.user.name);
        res.status(200).json({ message: "New Blog Created Successfully." });
    }

    catch (error) {
        console.error(error);
        next(error)
    }

}

const deleteBlog = async (req, res, next) => {
    try {

        const blog = await Blogs.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        await createLog("Blog title as " + blog.title + " by " + req.user.name + " has been deleted");
        res.status(200).json({ message: "Blog deleted successfully." });

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const updateBlog = async (req, res, next) => {
    try {

        const updateBlog = await Blogs.findByIdAndUpdate( { _id : req.body.id }, {
            title: req.body.title,
            subTitle: req.body.subTitle,
            description: req.body.description,
            createdBy: req.body.createdBy ?? "Admin"
        }, { new: true });

        if (!updateBlog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        await updateBlog.save();
        await createLog("Blog title as " + updateBlog.title + " by " + req.user.name + " has been updated");


        res.status(200).json({ message: "Blog updated successfully." });


    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const listAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blogs.find();

        let result = []
        for (let blog of blogs) {
            result.push({
                id: blog._id,
                title: blog.title,
                blogImage: blog.blogImage,
                createdBy: blog.createdBy,
                createdOn: blog.createdOn,
                status: blog.status
            })
        }

        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blogs.find({ status: true });
        res.status(200).json(blogs);
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const getDetailOfBlogById = async (req, res, next) => {
    try {

        const blogDetail = await Blogs.findById({ _id: req.params.id })

        if (!blogDetail) {
            return res.status(404).json({ status: "failed", error: "Blog not found" });
        }
        res.json({ data: blogDetail });

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const updateStatusOfBlog = async (req, res, next) => {
    try {

        const blog = await Blogs.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        await createLog("Blog title as " + blog.title + " by " + req.user.name + " status has been updated to " + req.body.status);
        res.status(200).json({ message: "Blog status updated successfully." });

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

module.exports = {
    createNewBlog,
    deleteBlog,
    updateBlog,
    listAllBlogs,
    getDetailOfBlogById,
    updateStatusOfBlog,
    getAllBlogs
};
