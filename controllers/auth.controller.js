const User = require("../models/user.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { createLog } = require("./log.controller");
const Settings = require('../models/settings.model');
const {
  verifyAccountEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../commons/emailTemplates");

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

    if (user?.password === undefined) {
      return res.status(401).send({ message: "This email is linked with social media" });
    }

    if (user?.accountStatus === "closed") {
      return res.status(401).send({ message: "This account has been closed." });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    // console.log("validPassword", validPassword);
    if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}auth/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return res.status(400).send({ message: "An Email sent to your account please verify" });
    }

    const token = user.generateAuthToken();

    let tempUser = { ...user._doc };

    delete tempUser.password;

    await Token.deleteMany({ userId: user._doc._id });

    // res.cookie("jwt-token", token, { httpOnly: true });

    // console.log(tempUser);

    res.status(200).send({ data: token, user: tempUser, message: "logged in successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const signup = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
const settings = await Settings.findOne();
    await sendEmail(user.email, "Verify Email", verifyAccountEmailTemplate(user, token, settings));

    await createLog("New Customer Signed Up on the System.");

    res.status(201).send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const createNewPassword = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      token: req.body.token,
    });

    if (!token) return res.status(409).send({ message: "Token is not valid" });

    const user = await User.findById(token.userId);

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    await Token.deleteOne({
      token: req.body.token,
    });
    res.status(201).send({ message: "Password recovered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(409).send({ message: "Given Email doesn't exists" });

    const checkAvailiableToken = await Token.findOne({ userId: user._id });

    if (checkAvailiableToken) {
      return res.status(409).send({ message: "A reset password link is already sent to email" });
    }

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const settings = await Settings.findOne();
    await sendEmail(user.email, "Reset Password", resetPasswordEmailTemplate(token, settings, user.firstName));

    await createLog(`Password reset request for user: ${user.email}`);

    res.status(201).send({ message: "A Password Reset Email sent to your account" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const verifyResetPasswordToken = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      token: req.body.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid token or Token has expired" });

    res.status(200).send({ message: "Reset Token verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  signup,
  verifyToken,
  resetPassword,
  verifyResetPasswordToken,
  createNewPassword,
};
