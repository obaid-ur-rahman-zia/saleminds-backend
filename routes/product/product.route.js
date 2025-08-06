// routes/productRoutes.js
const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductByIdForAdmin,
  deleteProductById,
  updatePopularValue,
  updateFeaturedValue,
  getMenu,
  updateProductById,
  getRelatedProducts,
  updateIsLive,
  updateAdditionalAttachments,
  addNewPictureToTheProduct,
  deletePictureFromExistingProduct,
  deleteAttachment,
  addAdditionalAttachment,
  fetchAllProductsList,
  updateProductSKU
} = require("../../controllers/product/product.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const check_auth = require("../../middlewares/check_auth")

const { v4: uuidv4 } = require('uuid');

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

const storageAttachments = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/templates/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const randomBasename = uuidv4(); // Generate a random UUID
    cb(null, `${randomBasename}${extname}`);
  },
});

const singleAttachment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/images/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const randomBasename = uuidv4(); // Generate a random UUID
    cb(null, `${randomBasename}${extname}`);
  },
});

const uploadAttachments = multer({ storage: storageAttachments });

const uploadSinglePicture = multer({ storage: singleAttachment });

// Route to create a new product
router.post("/",check_auth, upload.array("images"), createProduct);

router.post("/uploadImage",check_auth, uploadSinglePicture.any("image"),addNewPictureToTheProduct )

router.post("/deleteImage",check_auth ,deletePictureFromExistingProduct )

router.post("/uploadNewAttachment",check_auth,uploadSinglePicture.any("image"), addAdditionalAttachment)

router.post("/deleteAttachment",check_auth, deleteAttachment )

// Route to get all products
router.get("/", getAllProducts);

// Route to get a product by ID
router.get("/:id", getProductById);

router.get("/related-products/:categoryId", getRelatedProducts);

router.get("/getProductForAdmin/:id", getProductByIdForAdmin);

// Route to get products by category
router.get("/filter-category/:id", getProductsByCategory);

// Route to update a product by ID
router.post("/updateProduct/:id",check_auth, updateProductById);

// Route to delete a product by ID
router.delete("/:id",check_auth, deleteProductById);

//Route to update popular value
router.put("/updatePopularValue/:id",check_auth, updatePopularValue);

//Route to update featured value
router.put("/updateFeaturedValue/:id",check_auth, updateFeaturedValue);

//Route to update isLive value
router.put("/updateIsLive/:id",check_auth, updateIsLive);

router.get("/all/menu", getMenu);

router.post("/updateAdditionalAttachments/:id",check_auth, uploadAttachments.array("files"),updateAdditionalAttachments);

router.post("/productList", fetchAllProductsList)

router.post("/sku/update", updateProductSKU)


module.exports = router;
