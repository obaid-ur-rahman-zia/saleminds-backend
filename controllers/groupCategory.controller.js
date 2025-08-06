const GroupCategory = require("../models/groupCategory.model");
const Category = require("../models/category.model");
const { createLog } = require("./log.controller");
const fsPromises = require("fs").promises;

const createGroupCategory = async (req, res, next) => {
  const imagevar = req.files[0].destination + req.files[0].filename;
  try {
    let groupCategory = new GroupCategory({
      name: req.body.name,
      description: req.body.description,
      image: imagevar,
      tagLine: req.body.tagLine,
    });
    groupCategory = await groupCategory.save();
    await createLog("Created New Group Category named as " + groupCategory.name + " by " + req.user.name);
    res.status(200).json({ message: "Group category added successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllGroupCategories = async (req, res, next) => {
  try {
    const groupcategories = await GroupCategory.find();

    if (groupcategories.length === 0) {
      return res.status(404).json({ status: "failed", message: "No Group Category is available." });
    }
    // Fetch all categories name and add to the data
    const categories = await Category.find();

    const modifiedGroupCategories = [];

    groupcategories.forEach((groupcategory) => {
      const modifiedGroupCategory = {
        _id: groupcategory._id,
        name: groupcategory.name,
        description: groupcategory.description,
        tagLine: groupcategories.tagLine,
        image: groupcategory.image,
        categories: [],
      };
      groupcategory.categories.forEach((category) => {
        let categoryObj = categories.find((c) => c._id.toString() === category.toString())?.name;
        // check if categoryObj is not undefined
        if (categoryObj) {
          modifiedGroupCategory.categories.push(categoryObj);
        }
      });
      modifiedGroupCategories.push(modifiedGroupCategory);
    });

    res.json({ status: "success", data: modifiedGroupCategories });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getGroupCategoryById = async (req, res, next) => {
  try {
    const groupCategory = await GroupCategory.findById({ _id: req.params.id }).populate("categories");
    if (!groupCategory) {
      return res.status(404).json({ status: "failed", error: "Group Category not found" });
    }
    res.json({ status: "success", data: groupCategory });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateGroupCategoryById = async (req, res, next) => {
  var imagevar = null;
  if (req.body.oldImage) {
    try {
      await fsPromises.access(req.body.oldImage);
      await fsPromises.unlink(req.body.oldImage);
      console.log("File deleted successfully:", req.body.oldImage);
    } catch (error) {
      console.error("Error in deleting file:", req.body.oldImage, error);
    }
    imagevar = req.files[0].destination + req.files[0].filename;
  }
  else {
    imagevar = req.body.image;
  }
  try {
    const groupCategory = await GroupCategory.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        description: req.body.description,
        image: imagevar,
        tagLine: req.body.tagLine,
      },
      { new: true }
    );
    if (!groupCategory) {
      return res.status(400).json({ message: "Product Category not found" });
    }
    await createLog("Update Existing Group Category named as " + groupCategory.name + " by " + req.user.name);
    res.status(200).json({ message: "Product Category Updated Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteGroupCategoryById = async (req, res, next) => {
  try {

    // check if groupCategory has categories array empty or not 
    const groupCategoryHasCategory = await GroupCategory.findById({ _id: req.params.id }).populate("categories");

    if (groupCategoryHasCategory.categories.length > 0) {
      return res.status(200).json({ status: "success", message: "This Group Category has some categories, can't delete it." });
    }
    else {
      const groupCategory = await GroupCategory.findByIdAndDelete({ _id: req.params.id });
      if (!groupCategory) {
        return res.status(404).json({ status: "failed", message: "Group Category not found" });
      }
      await createLog("Delete Group Category named as " + groupCategory.name + " by " + req.user.name);

      const urlOfImg = groupCategory.image;

      try {
        await fsPromises.access(urlOfImg);
        await fsPromises.unlink(urlOfImg);
        console.log("File deleted successfully:", urlOfImg);
      } catch (error) {
        console.error("Error in deleting file:", urlOfImg, error);
      }

      res.status(200).json({ message: "Group Category deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createGroupCategory,
  getAllGroupCategories,
  getGroupCategoryById,
  updateGroupCategoryById,
  deleteGroupCategoryById,
};
