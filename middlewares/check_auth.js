const { verifyRefreshToken } = require("../helpers/helper")
const AdminUser = require("../models/adminUser.model")
module.exports = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization. Login again." });
    }

    const result = verifyRefreshToken(token);

    if (!result.success) {
        return res.status(401).json({ message: "Session Timeout. Login Again." });
    }

    req.user = result.data;

    // fetch userId and fetch user status from database and check if user is active or not
    // Find the user with the provided email
    const user = await AdminUser.findOne({ email: req.user.email });

    if (!user) {
        return res.status(401).json({ message: "Session Timeout. Login Again." });
    }

    if (user.status === "banned") {
        return res.status(401).json({ message: "Session Timeout. Login Again." });
    }

    next();
}