const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  loginUser,
  getDashboardData,
  updateUserRole,
  addNewQuery,
  getAllQueries,
  deleteQuery,
  sendEmailToIndividualUser,
  getAllSentEmails,
  updatePassword,
  getAllWebsiteCustomerList,
  addNewCustomEvent,
  deleteCustomEvent,
  listAllCustomEvents,
  updateCustomEventStatus,
  updateCustomEventDetail,
  updateLogoForCustomEvent,
  updateBackgroundImageForCustomEvent,
  fetchSpecificCustomEventDetail,
  fetchSpecificCustomEventDetailByPathName,
  markAccountAsClosed,
  markAsAdminThisUser,
  createJobBoardData,
  getStatsForAdmin,
  fetchLogs,
  sendEmailToUser,
  getQueryDetail,
  updateQueryDetail
} = require("../controllers/admin.controller");
const {
  createNewCustomGroup,
  getAllCustomGroups,
  deleteCustomGroup,
  getCustomGroupById,
  updateCustomGroup,
  getBestServiceProducts,
  getAllCustomGroupsForAdmin
} = require("../controllers/websiteCMS.controller");

const { getUserByEmailAddress } = require('../controllers/user.controller')


const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/admin/users/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const check_auth = require("../middlewares/check_auth");
const { create_Customer_OrderSummary, forgotPassword, resetPassword, validateResetToken } = require("../controllers/reporting.controller");

const upload = multer({ storage });

// Route to create a new AdminUser
router.post("/", check_auth, createUser);

// Route to get all AdminUser
router.get("/", check_auth, getAllUsers);

// Route to get a AdminUser by ID
router.get("/:id", check_auth, getUserById);

// Route to update a AdminUser
router.put("/updateProfile/:id", check_auth, upload.any("image"), updateUser);

// Route to update a AdminUser
router.put("/updateRole/:id", check_auth, updateUserRole);

// Route to delete a AdminUser
router.delete("/deleteUser/:id", check_auth, deleteUser);

// Route to update a AdminUser status
router.put("/update-status/:id", check_auth, updateUserStatus);

// Route to login the admin User
router.post("/login", loginUser);
// Route to Change the password
router.post("/change-password/:id", check_auth, updatePassword);


//Route to get dashboard info
router.post("/dashboardData/", check_auth, getDashboardData);

router.post("/dashboard/stats", check_auth, getStatsForAdmin)

router.post("/job-board", check_auth, createJobBoardData)

router.post("/logs", check_auth, fetchLogs)

//Route to create new custom product group
router.post("/website-cms/createCustomProductGroups/", check_auth, createNewCustomGroup);

//Route to get all custom product groups
router.get("/website-cms/getAllCustomGroups/", getAllCustomGroups);

router.get("/website-cms/getBestServiceProducts/", getBestServiceProducts);

//Route to delete custom product group
router.delete("/website-cms/deleteCustomGroup/:id", check_auth, deleteCustomGroup);

//Route to get custom product group by id
router.get("/website-cms/getCustomGroupById/:id", getCustomGroupById);

// Route to update custom product group
router.put("/website-cms/updateCustomGroup/:id", check_auth, updateCustomGroup);

//Route to get all custom product groups for admin
router.get("/website-cms/getAllCustomGroupsForAdmin/", getAllCustomGroupsForAdmin);

// Route to add new query
router.post("/query/add/", addNewQuery);

// Route to get all queries
router.get("/query/get/", getAllQueries);

router.get("/query/:id", getQueryDetail);

router.post("/query/update/:id", check_auth, updateQueryDetail);

// Route to delete a query
router.delete("/query/delete/:id", check_auth, deleteQuery);


// Route to send email to individual
router.post("/email/sendEmailToIndividualUser/", check_auth, sendEmailToIndividualUser);

router.post("/email/send", check_auth, sendEmailToUser)

// Route to get all sent emails
router.get("/email/getAllEmails/", getAllSentEmails)

//Route to get all websites customer list
router.post("/getAllCustomerList/", check_auth, getAllWebsiteCustomerList)

router.post("/customer/closed-account-status", check_auth, markAccountAsClosed)

router.post("/customer/mark-as-admin", check_auth, markAsAdminThisUser)

router.post("/event/add", check_auth, addNewCustomEvent)

router.post("/event/delete/:id", check_auth, deleteCustomEvent)

router.post("/event/list", check_auth, listAllCustomEvents)

router.post("/event/change-status/:id", check_auth, updateCustomEventStatus)

router.get("/event/details/:id", fetchSpecificCustomEventDetail)

router.get("/event/detailsByPath/:path", fetchSpecificCustomEventDetailByPathName)

router.post("/event/update/:id", check_auth, updateCustomEventDetail)

router.post("/event/update-logo/:id", check_auth, upload.any("image"), updateLogoForCustomEvent)

router.post("/event/update-backgrounImage/:id", check_auth, upload.any("image"), updateBackgroundImageForCustomEvent)

router.post("/customer/search-by-email/", check_auth, getUserByEmailAddress)

router.post("/reporting/create-customer-order-summary",check_auth, create_Customer_OrderSummary)

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/reset-password/validate/:token", validateResetToken);

module.exports = router;
