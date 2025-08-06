const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CLIENT_URL = process.env.CLIENT_URL;

// router.get("/login/success", (req, res, next) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Successfully Loged In",
//       user: req.user,
//     });
//   } else {
//     res.status(403).json({ error: true, message: "Not Authorized" });
//   }
// });

router.get("/login/success", (req, res, next) => {
  if (req.user) {
    if (req.user.accountStatus === "closed") {
      return res.status(403).json({ error: true, message: "This Account has been closed" });
    }
    const token = jwt.sign({ _id: req.user._id }, process.env.JWTPRIVATEKEY, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      token: token,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res, next) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect(`${CLIENT_URL}login`);
  });
  //   res.redirect(`${CLIENT_URL}login`);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}register`,
    failureRedirect: "/login/failed",
  })
);

// router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

// router.get(
//   "/github/callback",
//   passport.authenticate("github", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

module.exports = router;
