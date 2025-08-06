const MetaTags = require('../models/metaTags.model');
const { createLog } = require('./log.controller');


const createNewMetaTag = async (req, res, next) => {
    try {

        const alreadyFoundMetaTagWithThisName = await MetaTags.find({ metaName: req.body.metaName })

        if (alreadyFoundMetaTagWithThisName.length > 0) {
            return res.status(400).json({ message: "Meta Tag already exists." });
        }

        const newMetaTag = new MetaTags(req.body);
        await newMetaTag.save();
        createLog("New meta tag has been created " + " by " + req.user.name)
        res.status(200).json({ message: 'Meta tag created successfully' });
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const listAllMetaTag = async (req, res, next) => {

    try {
        const metaTags = await MetaTags.find();
        res.status(200).json(metaTags);
    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

const deleteMetaTag = async (req, res, next) => {
    try {
        const deletedMetaTag = await MetaTags.findByIdAndDelete(req.params.id);
        if (!deletedMetaTag) {
            return res.status(404).json({ message: "Meta tag not found." });
        }
        createLog("Meta tag has been deleted " + " by " + req.user.name)
        res.status(200).json({ message: 'Meta tag deleted successfully' });
    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

const updateMetaTag = async (req, res, next) => {
    try {
        const updatedMetaTag = await MetaTags.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMetaTag) {
            return res.status(404).json({ message: "Meta tag not found." });
        }
        createLog("Meta tag has been updated " + " by " + req.user.name)
        res.status(200).json(updatedMetaTag);
    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

const getDetailById = async (req, res, next) => {
    try {
        const metaTag = await MetaTags.findById(req.params.id);
        if (!metaTag) {
            return res.status(404).json({ message: "Meta tag not found." });
        }
        res.status(200).json(metaTag);
    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

module.exports = {
    createNewMetaTag,
    listAllMetaTag,
    deleteMetaTag,
    updateMetaTag,
    getDetailById
};