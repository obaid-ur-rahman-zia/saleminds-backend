const express = require("express");
const router = express.Router()

const { getContentOfRobotFile, updateContentOfRobotFile} = require("../controllers/seo.controller")
const check_auth = require("../middlewares/check_auth");

router.post("/robots/update",check_auth,updateContentOfRobotFile);
router.get("/robots/detail",check_auth, getContentOfRobotFile)

router.post("/sitemap/generate", check_auth)
router.post("/sitemap/detail", check_auth)
router.post("/sitemap/update", check_auth)
router.post("/sitemap/upload", check_auth)

module.exports = router;