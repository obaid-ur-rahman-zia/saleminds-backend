const Category = require("../models/category.model");
const Product = require("../models/product.model");
const GroupCategory = require("../models/groupCategory.model");
const fsPromises = require("fs").promises;

const { createLog } = require("./log.controller");

const createCategory = async (req, res, next) => {
  const allowedOptions = JSON.parse(req.body.allowedOptions);

  const images = req.files.map((file) => {
    return file.destination + file.filename;
  });
  const newImages = images.slice(0, images.length - 1);

  const bannerImage = images[images.length - 1];

  try {
    const alreadyExists = await Category.find({ name: req.body.name });

    if (alreadyExists.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let category = new Category({
      name: req.body.name,
      description: req.body.description,
      bannerImage: bannerImage,
      pictures: newImages,
      allowedOptions: allowedOptions,
    });

    category = await category.save();

    // now get this category id and add this category id to group category item which is in req.body
    const newCategoryId = category._id;
    const groupCategory = req.body.groupCategory;

    const groupCategoryObj = await GroupCategory.findById({ _id: groupCategory });

    if (!groupCategoryObj) {
      return res.status(400).json({ message: "Group Category not found" });
    }

    groupCategoryObj.categories.push(newCategoryId);

    await groupCategoryObj.save();
    await createLog("Created New Category named as " + category.name + " by " + req.user.name);
    res.status(200).json({ message: "Category Created Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(404).json({ status: "failed", message: "No Category is available." });
    }

    //fetch all product which have category id and then add extra products array with each category
    const products = await Product.find();
    const modifiedCategories = [];
    categories.forEach((category) => {
      const modifiedCategory = {
        _id: category._id,
        name: category.name,
        description: category.description,
        bannerImage: category.bannerImage,
        products: [],
      };
      products.forEach((product) => {
        if (product.category.toString() === category._id.toString()) {
          modifiedCategory.products.push(product);
        }
      });
      modifiedCategories.push(modifiedCategory);
    });
    res.json({ status: "success", data: modifiedCategories });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllCategoriesList = async (req, res, next) => {
  try {

    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(404).json({ status: "failed", message: "No Category is available." });
    }

    return res.status(200).json({ status: "success", data: categories });

  }
  catch (error) {
    console.error(error);
    next(error)
  }
}

const getAllCategoriesForClientTemplate = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(404).json({ status: "failed", message: "No Category is available." });
    }

    //fetch all product which have category id and then add extra products array with each category
    const products = await Product.find({ isLive: true });
    const modifiedCategories = [];
    categories.forEach((category) => {
      const modifiedCategory = {
        _id: category._id,
        name: category.name,
        description: category.description,
        bannerImage: category.bannerImage,
        products: [],
      };
      products.forEach((product) => {
        if (product.category.toString() === category._id.toString()) {
          modifiedCategory.products.push(product);
        }
      });
      modifiedCategories.push(modifiedCategory);
    });
    res.json({ status: "success", data: modifiedCategories });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getCategoryById = async (req, res, next) => {
  // console.log("Fetching Category with id:", req.params.id);
  try {
    const category = await Category.findById({ _id: req.params.id });
    if (!category) {
      return res.status(404).json({ status: "failed", error: "Category not found" });
    }
    res.json({ status: "success", data: category });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateCategoryById = async (req, res, next) => {
  let newbannerImage = "";
  let newPictures = [];

  const images = req.files.map((file) => {
    return file.destination + file.filename;
  });

  if (req.body.oldBannerImage) {
    newbannerImage = req.body.oldBannerImage;
  } else {
    newbannerImage = images[0];
    try {
      await fsPromises.access(req.body.oldBannerImageData);
      await fsPromises.unlink(req.body.oldBannerImageData);
    } catch (error) {
      console.log("Error in deleting Banner Image file:", req.body.oldBannerImageData, error);
    }
  }

  if (req.body.oldImage) {
    newPictures = JSON.stringify(req.body.oldImage);
  } else {
    const AllPictures = JSON.parse(req.body.oldImageData);
    AllPictures.map(async (v, i) => {
      try {
        await fsPromises.access(v);
        await fsPromises.unlink(v);
      } catch (error) {
        console.log("Error in deleting Banner Image file:", v, error);
      }
    });
    if (req.body.oldBannerImage) {
      newPictures = images[0];
    } else {
      newPictures = images.slice(1, images.length);
    }
  }

  try {
    const alreadyExists = await Category.findById({ _id: req.params.id });

    if (!alreadyExists) {
      return res.status(400).json({ message: "Category not found" });
    } else {
      const category = await Category.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          description: req.body.description,
          bannerImage: newbannerImage,
          pictures: newPictures,
        },
        { new: true }
      );
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      await createLog("Update Category named as " + category.name + " by " + req.user.name);
      res.status(200).json({ message: "Information Updated Successfully." });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    // check if this category has any products or not if it has then dont delete it
    const products = await Product.find({ category: req.params.id });

    if (products.length > 0) {
      return res.status(400).json({ message: "This Category has some products, can't delete it." });
    } else {
      const category = await Category.findByIdAndDelete({ _id: req.params.id });
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      await createLog("Delete Category named as " + category.name + " by " + req.user.name);

      const bannerImageURL = category.bannerImage;
      const allImagesURL = category.pictures;
      const allImages = [bannerImageURL, ...allImagesURL];
      allImages.forEach(async (urlOfImg) => {
        try {
          await fsPromises.access(urlOfImg);
          await fsPromises.unlink(urlOfImg);
          console.log("File deleted successfully:", urlOfImg);
        } catch (error) {
          console.error("Error in deleting file:", urlOfImg, error);
        }
      });
      res.status(200).json({ message: "Category deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategoriesForClientTemplate,
  getAllCategoriesList
};
