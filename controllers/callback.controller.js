const callBackRequest = require("../models/callback.model");
const { createLog } = require("./log.controller");

const pushNewCallBackRequest = async (req, res, next) => {
    try {

        const newCallBackRequest = new callBackRequest(req.body);
        await newCallBackRequest.save();

        res.status(201).json({ message: "Callback Request submitted successfully." });

        createLog(`New callback request created with id: ${newCallBackRequest._id}`);

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const fetchAllCallBackRequest = async (req, res, next) => {
    try {
        const callBackRequests = await callBackRequest.find();
        res.json(callBackRequests);
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}



module.exports = {
    pushNewCallBackRequest,
    fetchAllCallBackRequest,
};
