const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs")
const check_auth = require("../middlewares/check_auth")

const { getAllSettings, updateSettings, uploadLogo, uploadNewFontFile } = require("../controllers/settings.controller");

const upload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/logo/");
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        cb(null, `${basename}${extname}`);
    },
});

const uploadPicture = multer({ storage: upload });

const uploadFont = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/fonts/");
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        cb(null, `${basename}${extname}`);
    },
});

const uploadLogoOnDisk = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/logo/");
    },
    filename: (req, file, cb) => {
        cb(null, "logo.png");
    },
});

const uploadLogoMiddleware = multer({ storage: uploadLogoOnDisk });

const uploadNewFont = multer({ storage: uploadFont });

// Route to Get all settings
router.get("/", getAllSettings);

// Route to update settings
router.put("/update/:id", check_auth, updateSettings);

router.post("/uploadLogo/:id", check_auth, uploadLogoMiddleware.any("image"), uploadLogo)

router.post("/upload/newFont", check_auth, uploadNewFont.array("font"), uploadNewFontFile)

router.delete("/deleteFont/:font", check_auth, (req, res) => {
    const fontName = decodeURIComponent(req.params.font); // Decode the filename
    const fontPath = path.join(__dirname, "../public", "fonts", fontName);

    console.log(`Deleting font: ${fontPath}`);

    fs.access(fontPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send("Font not found");
        }

        fs.unlink(fontPath, (err) => {
            if (err) {
                return res.status(500).send("Error deleting font");
            }
            res.send("Font deleted successfully");
        });
    });
});

module.exports = router;

