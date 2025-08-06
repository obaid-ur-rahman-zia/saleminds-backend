const express = require("express");
const {
  createNewsletterSubscribedUsers,
  getAllNewsletterSubscribedUsers,
  deleteNewsletterSubscribedUser
} = require("../controllers/newsletterSubscribedUsers.controller");

const router = express.Router();

router.post("/", createNewsletterSubscribedUsers);

router.get("/", getAllNewsletterSubscribedUsers);

router.delete("/delete/",deleteNewsletterSubscribedUser)

module.exports = router;
