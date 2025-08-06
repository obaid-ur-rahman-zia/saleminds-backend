const Product = require("../../models/product.model");
const ProductOption = require("../../models/product/productOption.model");
const ProductOptionValue = require("../../models/product/productOptionValue.model");
const Category = require("../../models/category.model");
const GroupCategory = require("../../models/groupCategory.model");
const path = require("path");
const fsPromises = require("fs").promises;

const ProductSKU = require("../../models/productSKUs")

const he = require("he");

const { createLog } = require("../log.controller");

const createProduct = async (req, res, next) => {
  let images = [];
  // check if req.files is not empty and if it is empty then return error
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Please upload at least one image" });
  } else {
    images = req.files.map((file) => file.destination + file.filename);
  }
  const temp = JSON.parse(req.body.options);
  const designer = JSON.parse(req.body.designer);
  const tempaddedBy = req.body.addedBy;
  const category = JSON.parse(req.body.category);
  const discount = req.body.discount;
  console.log(discount);

  const tempCategory = category;

  try {
    const allreadyExistProduct = await Product.findOne({ name: req.body.name });
    if (allreadyExistProduct) {
      return res.status(400).json({ message: "Product with this name already exist" });
    }
    await Product.create({
      ...req.body,
      handlingFee: req.body.handlingFee,
      upsPackagingType: req.body.upsPackagingType,
      productWeightCategory: req.body.productWeightCategory,
      images: images,
      discount: discount,
      designer: designer,
      addedBy: tempaddedBy,
      options: temp,
      category: tempCategory,
      additionalAttachments: {
        mediaType: "pictures",
        description: "",
        pictures: [],
      },
      cutOffTime: req.body.cutOffTime,
      tax_vat: req.body.tax_vat,
      productionDays: req.body.productionDays,
      isFeatured: req.body.isFeatured === "true" ? true : false,
      isPopular: req.body.isPopular === "true" ? true : false,
      setupPrice: req.body.setupPrice,
      isDelivery: req.body.isDelivery,
      isPickup: req.body.isPickup,
      allowRequestAQuote: req.body.allowRequestAQuote,
      allowForegroundColorSelector: req.body.allowForegroundColorSelector,
      allowBackgroundColorSelector: req.body.allowBackgroundColorSelector
    })
      .then((response) => {
        console.log("Product Added: ", response);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
    await createLog("New Product Added By " + req.user.name + " named as " + req.body.name);
    res.status(200).json({ status: "success", message: "Product created successfully" });
  } catch (error) {
    console.error(error);
    next(error)
    // delete all images from public folder if error occurs
    images.forEach(async (image) => {
      const filePath = path.join(image);
      try {
        await fsPromises.access(filePath);
        await fsPromises.unlink(filePath);
        console.log("File deleted successfully:", filePath);
      } catch (error) {
        console.error("Error in deleting file:", filePath, error);
      }
    });
  }
};

const addNewPictureToTheProduct = async (req, res, next) => {

  try {

    let productId = req.body.productId;
    let existingImages = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    let newImage = req.files.map((file) => file.destination + file.filename);

    const productFound = await Product.findOne({ _id: productId });

    if (!productFound) {
      return res.status(400).json({ message: "Product not found" });
    }

    existingImages = productFound.images;

    existingImages.push(newImage[0]);

    await Product.findOneAndUpdate({ _id: productId }, { images: existingImages }, { new: true });

    await createLog(
      "New Picture Added To Product named as " + productFound.name + " by " + req.user.name
    );

    res.status(200).json({ message: "Picture added successfully" });

  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deletePictureFromExistingProduct = async (req, res, next) => {
  let productId = req.body.productId;
  let imageName = req.body.imageName;

  try {
    const productFound = await Product.findOne({ _id: productId });

    if (!productFound) {
      return res.status(400).json({ message: "Product not found" });
    }

    let existingImages = productFound.images;
    existingImages = existingImages.filter((image) => image !== imageName);

    await Product.findByIdAndUpdate({ _id: productId }, { images: existingImages }, { new: true });

    await createLog(
      "Delete picture from Product named as " + productFound.name + " by " + req.user.name
    );

    return res.status(200).json({ message: "Image Deleted Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category").populate("addedBy").exec();
    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getProductByIdForAdmin = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }

    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("productWeightCategory")
      .exec();
    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.id }).populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateProductById = async (req, res, next) => {
  console.log("Data: ", req.body);

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      setupPrice: req.body.setupPrice,
      handlingFee: req.body.handlingFee,
      upsPackagingType: req.body.upsPackagingType,
      productWeightCategory: req.body.productWeightCategory,
      category: req.body.category,
      isFeatured: req.body.isFeatured,
      isService: req.body.isService,
      isPopular: req.body.isPopular,
      quantity: req.body.quantity,
      designer: req.body.designer,
      options: req.body.options,
      discount: req.body.discount,
      additionalPrices: req.body.additionalPrices,
      cutOffTime: req.body.cutOffTime,
      productionDays: req.body.productionDays,
      tax_vat: req.body.tax_vat,
      description: he.decode(req.body?.description),
      rules: req.body?.rules || [],
      isDelivery: req.body.isDelivery,
      isPickup: req.body.isPickup,
      allowForegroundColorSelector: req.body.allowForegroundColorSelector,
      allowBackgroundColorSelector: req.body.allowBackgroundColorSelector
    })
      .then((response) => {
        createLog("Update Product Details named as " + req.body.name + " by " + req.user.name);
        res.status(200).json({ message: "Product updated successfully" });
      })
      .catch((error) => {
        console.error(error);
        next(error)
      });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    // Delete all pictures before deleting the product
    const productThatsNeedToBePicturesDeleted = await Product.findById(req.params.id);

    if (productThatsNeedToBePicturesDeleted) {
      const imageDeletionPromises = productThatsNeedToBePicturesDeleted.images.map(
        async (image) => {
          const filePath = path.join(image);
          // console.log("filePath: ", filePath);
          try {
            await fsPromises.access(filePath);
            await fsPromises.unlink(filePath);
            console.log("File deleted successfully:", filePath);
          } catch (error) {
            console.error("Error in deleting file:", filePath, error);
          }
        }
      );

      // Wait for all image deletion promises to complete
      await Promise.all(imageDeletionPromises);
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }

    await createLog("Delete Product " + req.user.name + " Admin named as " + deletedProduct.name);

    res.json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updatePopularValue = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      isPopular: req.body.isPopular,
    });
    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product status updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getMenu = async (req, res, next) => {
  try {
    const products = await Product.find({ isLive: true });
    const groupCategories = await GroupCategory.find().populate("categories");
    const categories = await Category.find();
    res.status(200).json({ products, groupCategories, categories });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getRelatedProducts = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    // Your logic to find related products based on productId
    const relatedProducts = await Product.find({ category: categoryId, isLive: true })
      .limit(9)
      .exec();
    res.json(relatedProducts);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateFeaturedValue = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      isFeatured: req.body.isFeatured,
    });
    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product status updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateIsLive = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      isLive: req.body.isLive,
    });
    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product status updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateAdditionalAttachments = async (req, res, next) => {
  const newAttachments = req.files.map((file) => file.destination + file.filename);
  const fileNames = JSON.parse(req.body.fileNames);
  let attachmentsToBeUploaded = [];
  for (let i = 0; i < fileNames.length; i++) {
    attachmentsToBeUploaded.push({
      filename: fileNames[i],
      filePath: newAttachments[i],
    });
  }
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      additionalAttachments: attachmentsToBeUploaded,
    });
    if (!product) {
      return res.status(400).json({ status: "failed", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product attachments updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const addAdditionalAttachment = async (req, res, next) => {
  try {
    let productId = req.body.productId;
    let attachmentName = req.body.attachmentName;
    let existingImages = [];

    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({ message: "Please upload at least one image" });
    // }

    console.log("Files: ", req.files);

    let newImage = req.files.map((file) => file.destination + file.filename);

    const productFound = await Product.findOne({ _id: productId });

    if (!productFound) {
      return res.status(400).json({ message: "Product not found" });
    }

    existingImages = productFound.additionalAttachments?.pictures;

    if (req.body.mediaType === "pictures") {
      existingImages.push({
        filename: attachmentName,
        filePath: newImage[0],
        fileExtName: "",
      });
    }

    let newObj = {};

    if (req.body.mediaType === "pictures") {
      newObj = {
        mediaType: req.body.mediaType,
        pictures: existingImages,
        description: productFound.additionalAttachments?.description,
      };
    } else {
      newObj = {
        mediaType: req.body.mediaType,
        pictures: productFound.additionalAttachments?.pictures,
        description: he.decode(req.body?.description),
      };
    }
    await Product.findOneAndUpdate(
      { _id: productId },
      { additionalAttachments: newObj },
      { new: true }
    );

    await createLog(
      "New Additional Attachment Added To Product named as " +
      productFound.name +
      " by " +
      req.user.name
    );

    res.status(200).json({ message: "Attachment Information updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteAttachment = async (req, res, next) => {
  try {
    let productId = req.body.productId;
    let attachmentFileName = req.body.attachmentFileName;

    const productFound = await Product.findOne({ _id: productId });

    if (!productFound) {
      return res.status(400).json({ message: "Product not found" });
    }

    // i want to delete the attachment file name object in this existing product attachment
    let existingAttachments = productFound.additionalAttachments.pictures;
    let newAttachments = [];
    for (let i = 0; i < existingAttachments.length; i++) {
      if (existingAttachments[i].filename !== attachmentFileName) {
        newAttachments.push(existingAttachments[i]);
      } else {
        let filePath = path.join(existingAttachments[i].filePath);
        console.log("filePath: ", existingAttachments[i].filePath);
        try {
          await fsPromises.access(existingAttachments[i].filePath);
          await fsPromises.unlink(existingAttachments[i].filePath);
          console.log("File deleted successfully:", existingAttachments[i].filePath);
        } catch (error) {
          console.error("Error in deleting file:", existingAttachments[i].filePath, error);
        }
      }
    }

    let newObj = {
      mediaType: productFound.additionalAttachments.mediaType,
      pictures: newAttachments,
      description: productFound.additionalAttachments.description,
    };

    await Product.findOneAndUpdate(
      { _id: productId },
      { additionalAttachments: newObj },
      { new: true }
    );

    await createLog(
      "Delete Additional Attachment from Product named as " +
      productFound.name +
      " by " +
      req.user.name
    );

    res.status(200).json({ message: "Attachment Deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const fetchAllProductsList = async (req, res, next) => {
  try {
    const products = await Product.find();

    // Use map to create an array of product names and IDs

    // i want those product who has type of 'priceCategory: "size_based"'
    const sizeBasedProducts = products.filter((product) =>
      product.priceCategory === "fixed_quantity"
    );

    const allProductList = sizeBasedProducts.map(product => ({ name: product.name, id: product._id }));

    res.status(200).json({ data: allProductList });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

// const addNewProductSKU = async (req, res, next) => {
//   try {

//     let { productId, productSKUs } = req.body;

//     await ProductSKU.create({
//       product: productId,
//       skus: productSKUs
//     }).
//       then((response) => {
//         console.log(response);
//         res.status(201).json({ status: "success", message: "Product SKU created successfully" })
//       })
//       .catch((error) => {
//         console.error(error);
//         res.status(400).json({ status: "failed", message: error })
//       })

//   }
//   catch (error) {
//     console.error(error);
//     res.status(400).json({
//       status: "failed", message: "Error in adding new product sku"
//     })
//   }
// }

const updateProductSKU = async (req, res, next) => {
  try {

    let { productId, productSKUs } = req.body;

    await Product.findOneAndUpdate({
      _id: productId
    }, {
      skus: productSKUs
    })
      .then((response) => {
        console.log(response);
        res.status(200).json({ status: "success", message: "Product SKU updated successfully" })
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ status: "failed", message: error })
      })

  }
  catch (error) {
    console.error(error);
    next(error)
  }
}


module.exports = {
  getRelatedProducts,
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getMenu,
  getProductByIdForAdmin,
  deleteProductById,
  updatePopularValue,
  updateFeaturedValue,
  updateProductById,
  updateIsLive,
  updateAdditionalAttachments,
  addNewPictureToTheProduct,
  deletePictureFromExistingProduct,
  deleteAttachment,
  addAdditionalAttachment,
  fetchAllProductsList,
  updateProductSKU
};
