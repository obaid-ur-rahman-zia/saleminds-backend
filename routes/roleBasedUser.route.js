const express = require("express");
const router = express.Router()

const { createNewRoleBasedUser, getAllRolesBasedUsers, deleteUserRole,getRoleDetail,updateRoleDetails } = require("../controllers/roleBasedUser.controller")

router.post("/create/",createNewRoleBasedUser);
router.get("/all/", getAllRolesBasedUsers)
router.delete("/delete/:id", deleteUserRole)
router.get("/:id",getRoleDetail)
router.post("/update/:id",updateRoleDetails)

module.exports = router;