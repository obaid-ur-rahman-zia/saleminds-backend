const Settings = require('../models/settings.model');
const { createLog } = require("./log.controller")
const he = require("he")

const getAllSettings = async (req, res, next) => {

    try {
        const settings = await Settings.find();
        res.status(200).json({ data: settings });
    } catch (error) {
        console.error(error);
        next(error)
    }
}

const updateSettings = async (req, res, next) => {

    try {

        console.log("Req Body: ", req.body)

        await Settings.findOneAndUpdate(
            { _id: req.params.id },
            {
                ...req.body, isDelivery: req.body.isDelivery, isPickup: req.body.isPickup, returnPolicy: he.decode(req.body?.returnPolicy), shippingPolicy: he.decode(req.body?.shippingPolicy), privacyPolicy: he.decode(req.body?.privacyPolicy),
                rewardPolicy: he.decode(req.body?.rewardPolicy),
                googleBusinessAccount: req.body.googleBusinessAccount
            },
            { new: true }
        );

        await createLog("Settings updated by " + req.user.name);

        res.status(200).json({ message: "Settings updated successfully" });

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const uploadLogo = async (req, res, next) => {

    console.log("Entering...")

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload logo." });
        }

        console.log("Req Files: ", req.files)

        let newImage = req.files.map((file) => file.destination + file.filename);

        await Settings.findOneAndUpdate(
            { _id: req.params.id },
            {
                logo: newImage[0]
            },
            { new: true }
        );

        await createLog("Logo updated by " + req.user.name);

        res.status(200).json({ message: "Picture updated successfully" });

    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

const uploadNewFontFile = async (req, res, next) => {

    console.log("Entering...")

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload font file." });
        }

        console.log("Req Files: ", req.files)

        res.status(200).json({ message: "Fonts Families updated successfully." });

    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

module.exports = {
    getAllSettings,
    updateSettings,
    uploadLogo,
    uploadNewFontFile
}