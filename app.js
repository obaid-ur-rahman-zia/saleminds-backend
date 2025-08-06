const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
dotenv.config();
const verifyTokenMiddleware = require("./middlewares/auth");
const fs = require("fs")

// routes import
const productRoute = require("./routes/product/product.route");
const productOptionRoute = require("./routes/product/productOption.route");
const productOptionValueRoute = require("./routes/product/productOptionValue.route");
const categoryRoute = require("./routes/category.route");
const groupCategoryRoute = require("./routes/groupCategories.route");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const addressRoute = require("./routes/address.route");

const shippingMethodRoute = require("./routes/shippingMethod.route");

const orderRoute = require("./routes/order.route");

const paypalRoute = require("./routes/paypal/paypal.route");

const productReview = require("./routes/productReview.route");

const adminRoute = require("./routes/admin.route");

const offerRoute = require("./routes/offer.route");

const contactusRoute = require("./routes/contactus.route");

const stripeRoute = require("./routes/stripe/stripe.route");
const passportRoute = require("./routes/passport.route");

const settingsRoute = require("./routes/settings.route");
const newsletterSubscribedUsersRoute = require("./routes/newsletterSubscribedUsers.route");
const canvasRoute = require("./routes/canvas.route");
const voucherRoute = require("./routes/voucher.route");
const quoteRoute = require("./routes/quote.route");
const roleBasedUserRoute = require("./routes/roleBasedUser.route");
const bugReportRoute = require("./routes/bugreport.route");
const eventsRoute = require("./routes/events.route");
const authorizeNet = require("./routes/authorizeNet/authorizeNet.route");
const passport = require("passport");
const passportSetup = require("./lib/passport");
const session = require("express-session");
const { default: puppeteer } = require("puppeteer");
const creditCardType = require("credit-card-type");
const upsRoute = require("./routes/ups.route");
const productWeightCategory = require("./routes/productWeightCategory.route");
const metaTagsRoute = require("./routes/metaTags.route");
const seoRoute = require("./routes/seo.route");
const blogRoute = require("./routes/blogs.route");
const callbackRoute = require("./routes/callbackRoute");
const customEstimate = require("./routes/customEstimate.route");
const shareCart = require("./routes/sharecart.route");
const check_auth = require("./middlewares/check_auth");
const errorHandler = require("./commons/error-handler");
const urlRoute = require("./routes/url.route");
const reportingRoute = require('./routes/reporting.route')
const blogSettingsRoute = require("./routes/blogSettings.route");

let databaseConnectionStatus = false;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connection established with Mongo DB !");
    databaseConnectionStatus = true;
  })
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
// Serve static files
app.use("/public/fonts", express.static(path.join(__dirname, "public/fonts"), {
  setHeaders: (res, path, stat) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  }
}));

app.set("trust proxy", true);

app.use(helmet());
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use(cookieParser());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10000, // limit each IP to 100 requests per windowMs
// });

// app.use(limiter);

app.use(compression());

app.use(
  session({
    secret: "YOUR SECRET KEY",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH"
  })
);

// app.use("/images", express.static(path.join(__dirname, "images")));

app.post("/download", (req, res) => {
  try {
    const filePathFromBody = req.body.filePath;

    console.log("Requested filePath:", filePathFromBody);

    const absolutePath = path.join(__dirname, filePathFromBody);
    console.log("Resolved absolute path:", absolutePath);

    if (!fs.existsSync(absolutePath)) {
      console.error("❌ File does not exist at:", absolutePath);
      return res.status(404).json({ message: "File not found" });
    }

    const fileName = path.basename(absolutePath);
    const stat = fs.statSync(absolutePath);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);

    const readStream = fs.createReadStream(absolutePath);
    readStream.pipe(res);

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    res.status(500).json({ message: "Unexpected server error" });
  }
});



app.use("/fonts", (req, res) => {
  fs.readdir("./public/fonts", (err, files) => {
    if (err) return res.status(500).send("Error reading fonts");
    res.json(files.filter((file) => file.endsWith(".ttf") || file.endsWith(".otf")));
  });
});

// app.use("/public/fonts", (req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
//   res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });



// routes
app.use("/product", productRoute);
app.use("/product-option", productOptionRoute);
app.use("/product-option-value", productOptionValueRoute);
app.use("/category", categoryRoute);
app.use("/group-category", groupCategoryRoute);
app.use("/auth", authRoute);
app.use("/auth", passportRoute);
app.use("/user", verifyTokenMiddleware, userRoute);
app.use("/address", addressRoute);
app.use("/shipping-method", shippingMethodRoute);
app.use("/order", orderRoute);
app.use("/paypal", paypalRoute);
app.use("/productReview", productReview);
app.use("/admin", adminRoute);
app.use("/offer", offerRoute);
app.use("/contactus", contactusRoute);
app.use("/stripe", stripeRoute);
app.use("/settings", settingsRoute);
app.use("/newsletterSubscribedUsers", newsletterSubscribedUsersRoute);
app.use("/voucher", voucherRoute);
app.use("/canvas", canvasRoute);
app.use("/quote", quoteRoute);
app.use("/role-based-user", check_auth, roleBasedUserRoute);
app.use("/authorizeNet", authorizeNet);
app.use("/ups", upsRoute);
app.use("/product-weight-category", productWeightCategory);
app.use("/bug-report", bugReportRoute);
app.use("/events", eventsRoute);
app.use("/meta-tags", metaTagsRoute);
app.use("/seo", seoRoute);
app.use("/blog", blogRoute);
app.use("/url", urlRoute);
app.use("/callback", callbackRoute);
app.use("/custom-estimate", customEstimate);
app.use("/share-cart", verifyTokenMiddleware, shareCart);
app.use("/reporting", reportingRoute)
app.use("/settings/blog", blogSettingsRoute);

app.use("/card-type", (req, res, next) => {
  var visaCards = creditCardType(req.body.cardNumber);
  res.send(visaCards[0]);
});

// Global error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT + " !");
});
