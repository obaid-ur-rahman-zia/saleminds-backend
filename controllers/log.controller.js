const Log = require('../models/logs.model');

const getLogs = async (req, res, next) => {
    try {
        const logs = await Log.find();
        res.json(logs);
    } catch (error) {
        console.error(error);
        next(error)
    }
}

const createLog = async (message) => {
    const log = new Log({
        message: message,
    });
    try {
        await log.save();
    } catch (error) {
        console.error(error);
        next(error)
    }
}

module.exports = {
    getLogs,
    createLog
};