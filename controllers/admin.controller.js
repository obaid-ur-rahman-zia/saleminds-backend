"user strict";

const config = require("config");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const RoleBasedUser = require("../models/roleBasedUser.model");
const AdminUser = require("../models/adminUser.model");
const Query = require("../models/query.model");
const Log = require("../models/logs.model");
const sendEmail = require("../utils/sendEmail");
const email = require("../models/email.model");
const jwt = require("jsonwebtoken");

const Settings = require("../models/settings.model")
const path = require("path");

const OrderStatus = require("../models/orderStatus.model");
const CustomEvent = require("../models/customEvents.model.");

const moment = require("moment");  // For handling date formatting

const { sendEmailToIndividualUserTempate, sendOrderEmailTemplate, sendResendInvoiceEmailTemplate} = require("../commons/emailTemplates");

const he = require("he");

const { createLog } = require("./log.controller");
const { generateRandom } = require("../helpers/helper");

const pdf = require("html-pdf");

const createUser = async (req, res, next) => {
  try {
    // Check if the user with the given email already exists
    const existingUser = await AdminUser.findOne({ email: req.body.email });

    console.log("Existing...: ", existingUser);

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const default_image = "public/uploads/admin/users/default_image.png";

    const { email, name, telephone, role } = req.body;

    // Hashing the password before saving to the database
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new AdminUser({
      email,
      name,
      password: hashedPassword,
      telephone,
      role,
      image: default_image,
    }).save();

    await createLog("Created New Admin User named as " + newUser.name + " by " + req.user.name);

    res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingUser = await AdminUser.findById({ _id: id });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const { name, telephone, role, status } = req.body;

    let temp;

    //check if req.body has oldImage
    if (req.body.oldImage) {
      temp = req.body.oldImage;
    } else {
      temp = req.files[0].destination + req.files[0].filename;
    }

    existingUser.name = name;
    existingUser.telephone = telephone;
    existingUser.image = temp;
    existingUser.role = role;
    existingUser.status = status;

    await existingUser.save();

    await createLog("Update admin user " + existingUser.name + " by " + req.user.name);

    res.status(200).json({ status: "success", message: "User updated", data: existingUser });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updatePassword = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingUser = await AdminUser.findById({ _id: id });

    if (!existingUser) {
      return res.status(400).json({ status: "failed", message: "User not found" });
    }

    const { password, newPassword } = req.body;

    // const isPasswordValid = await bcrypt.compare(password, user.password);

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({
          status: "failed",
          message: "your current password is invalid. please enter valid current password.",
        });
    }

    // Hashing the password before saving to the database
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    existingUser.password = hashedPassword;

    await existingUser.save();

    res.status(200).json({ status: "success", message: "Password Update Successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteUser = async (req, res, next) => {
  // console.log("deleteUser");
  // console.log(req.params.id);
  try {
    // check if this user added any product to the database if it added then dont delete this user

    const { id } = req.params;

    const usersAddedProducts = await Product.find({ addedBy: id });

    if (usersAddedProducts.length > 0) {
      return res.status(400).json({
        message: "This user added some products to the database so you can't delete this user",
      });
    }

    const deletedUser = await AdminUser.findByIdAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    await createLog("Deleted Admin User named as " + deletedUser.name + " by " + req.user.name);

    res.json({ status: "success", message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user
    const user = await AdminUser.findById({ _id: id });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.role = req.body.role;

    await user.save();

    await createLog("Updated Admin User " + user.name + " role by " + req.user.name);

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user
    const user = await AdminUser.findById({ _id: id });

    if (!user) {
      return res.status(400).json({ status: "failed", message: "User not found" });
    }

    if (user.status == "banned") {
      user.status = "unbanned";
    } else {
      user.status = "banned";
    }

    await user.save();

    await createLog("Updated Admin User " + user.name + " Status by " + req.user.name);

    res.json({ status: "success", message: "User status updated successfully", user });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    let users = await AdminUser.find();

    if (!users) {
      return res.status(401).json({ message: "Admin Users not found" });
    }
    // Fetch numbers of products added by each user and add extra key in users object of numberOfProductsAdded
    const usersAddedProducts = await Product.aggregate([
      {
        $group: {
          _id: "$addedBy",
          products: { $sum: 1 },
        },
      },
    ]);

    let newDataOfUser = [];

    const allUserRoles = await RoleBasedUser.find();

    // match the users and usersAddedProducts and add the numberOfProductsAdded key in users object
    users.forEach((user) => {
      const userProducts = usersAddedProducts.find(
        (product) => product._id.toString() === user._id.toString()
      );

      let userRoles = allUserRoles.find((role) => role._id.toString() === user.role.toString());

      let userRole;

      if (userRoles) {
        userRole = userRoles.name;
      } else {
        userRole = "NaN";
      }

      if (userProducts) {
        newDataOfUser.push({
          ...user._doc,
          numberOfProductsAdded: userProducts.products,
          role: userRole,
        });
      } else {
        newDataOfUser.push({ ...user._doc, numberOfProductsAdded: 0, role: userRole });
      }
    });
    res.json({ status: "success", data: newDataOfUser });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getUserById = async (req, res, next) => {
  // console.log(req.params.id);
  try {
    const userId = req.params.id;

    // Fetch the user from the database
    const user = await AdminUser.findById({ _id: userId });

    if (!user) {
      return res.status(400).json({ status: "failed", message: "User not found" });
    }

    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, ipAddress, countryName } = req.body;
    // console.log(req.body);

    // Find the user with the provided email
    const user = await AdminUser.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email. User does not exist with this email." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    if (user.status === "banned") {
      return res.status(400).json({ message: "Your account is banned. Please contact to admin." });
    }

    const userRoles = await RoleBasedUser.find({
      _id: user.role,
    });

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      telephone: user.telephone,
      role: user.role,
      image: user.image,
    };

    const secret = config.get("v1.JWT_SECRET");
    const options = { expiresIn: config.get("v1.JWT_EXPIRY") };

    const token = jwt.sign(payload, secret, options);

    let tempUser = { ...user, userRoles };

    delete tempUser.password;

    res.cookie("token", token, { httpOnly: true, secure: true });

    await createLog(user.name + " logged in from " + ipAddress + " and country is " + countryName);

    return res.status(200).json({ user: tempUser, token: token });
  } catch (error) {
    console.error(error);
    next(error)
  }
};



const getDashboardData = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments({});
    const userOrders = await Order.countDocuments({});
    const productsCount = await Product.countDocuments({});
    const adminUsersCount = await AdminUser.countDocuments({});

    let totalSales = 0;

    const logs = await Log.find({}).sort({ timestamp: -1 }).limit(5);

    const allOrders = await Order.find({});

    let ordersDataOfEarning = await Promise.all(
      allOrders.map(async (order) => {
        const tempUser = await User.findById(order.userId);
        let tempData2 = [];
        for (let i = 0; i < order.cartItems.length; i++) {
          const tempProduct = await Product.findById(order.cartItems[i].productId);
          tempData2.push(tempProduct);
        }
        totalSales += order.grandTotal;
        return {
          user: {
            name: tempUser?._doc?.firstName + " " + tempUser?._doc?.lastName,
            country: order.paymentDetails.billingAddress,
            registered: tempUser?._doc?.registeredAt,
          },
          order: {
            totalAmount: order.grandTotal,
            cartTotal: order.cartTotal,
            coupon: order.coupon,
            productsName: tempData2,
          },
          payment: {
            name: order.paymentDetails.paymentMethod,
            status: order.paymentDetails.paymentStatus,
          },
          activityTime: {
            time: order.orderDate,
          },
        };
      })
    );

    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const ordersData = await Order.aggregate([
      {
        $match: {
          createdOn: {
            $gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
            $lte: new Date(new Date().getFullYear(), 11, 31), // End of current year
          },
        },
      },
      {
        $project: {
          month: { $month: { $toDate: "$createdOn" } }, // Extract numeric month from createdOn
        },
      },
      {
        $group: {
          _id: "$month", // Group by numeric month
          orders: { $sum: 1 }, // Count orders per month
        },
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              allMonths,
              { $subtract: ["$_id", 1] }, // Map numeric month to month name
            ],
          },
          orders: {
            $ifNull: ["$orders", 0], // Default to 0 if orders is null
          },
          _id: 0, // Exclude _id from the result
        },
      },
    ]);

    allMonths.forEach((month) => {
      const isMonthPresent = ordersData.find((order) => order.month === month);
      if (!isMonthPresent) {
        ordersData.push({ month, orders: 0 });
      }
    });

    ordersData.sort((a, b) => allMonths.indexOf(a.month) - allMonths.indexOf(b.month));


    const orders = await Order.find({}).populate('userId').populate('cartItems.productId');
    const now = new Date();

    // Helper functions
    const startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));
    const startOfWeek = (date) => {
      const day = date.getDay() || 7; // Adjust when day is Sunday
      return new Date(date.setDate(date.getDate() - day + 1));
    };
    const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfLastMonth = (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const endOfLastMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 0);

    // Filter functions
    const filterOrdersByDate = (startDate, endDate) =>
      orders.filter(
        (order) => new Date(order.createdOn) >= startDate && new Date(order.createdOn) <= endDate
      );

    // Calculate sales data
    const todayOrders = filterOrdersByDate(startOfDay(new Date()), endOfDay(new Date()));
    const yesterdayOrders = filterOrdersByDate(
      startOfDay(new Date(now.setDate(now.getDate() - 1))),
      endOfDay(new Date(now.setDate(now.getDate() - 1)))
    );
    const thisWeekOrders = filterOrdersByDate(startOfWeek(new Date()), new Date());
    const lastWeekOrders = filterOrdersByDate(
      startOfWeek(new Date(now.setDate(now.getDate() - 7))),
      startOfWeek(new Date())
    );
    const thisMonthOrders = filterOrdersByDate(startOfMonth(new Date()), new Date());
    const lastMonthOrders = filterOrdersByDate(
      startOfLastMonth(new Date()),
      endOfLastMonth(new Date())
    );

    // Helper to calculate total amounts and order counts
    const calculateStats = (orderArray) => ({
      totalAmount: orderArray.reduce((acc, order) => acc + order.grandTotal, 0).toFixed(2),
      orderCount: orderArray.length,
    });

    // Updated sales statistics as an array
    const salesStatistics = [
      {
        label: "Today",
        totalAmount: calculateStats(todayOrders).totalAmount,
        orderCount: calculateStats(todayOrders).orderCount,
      },
      {
        label: "Yesterday",
        totalAmount: calculateStats(yesterdayOrders).totalAmount,
        orderCount: calculateStats(yesterdayOrders).orderCount,
      },
      {
        label: "This Week",
        totalAmount: calculateStats(thisWeekOrders).totalAmount,
        orderCount: calculateStats(thisWeekOrders).orderCount,
      },
      {
        label: "Last Week",
        totalAmount: calculateStats(lastWeekOrders).totalAmount,
        orderCount: calculateStats(lastWeekOrders).orderCount,
      },
      {
        label: "This Month",
        totalAmount: calculateStats(thisMonthOrders).totalAmount,
        orderCount: calculateStats(thisMonthOrders).orderCount,
      },
      {
        label: "Last Month",
        totalAmount: calculateStats(lastMonthOrders).totalAmount,
        orderCount: calculateStats(lastMonthOrders).orderCount,
      },
    ];

    const dashboardData = {
      usersCount,
      userOrders,
      productsCount,
      adminUsersCount,
      ordersData,
      logs,
      salesStatistics,
      ordersDataOfEarning,
      totalSales,
    };

    res.json({ status: "success", data: dashboardData });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getStatsForAdmin = async (req, res, next) => {
  try {

    // For Customer Section
    const now = new Date();

    // Helper functions to get start and end of days
    const startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));

    // Start of 7 days ago
    const sevenDaysAgo = startOfDay(new Date(now.setDate(now.getDate() - 6)));

    // Fetch total customers
    const totalCustomers = await User.countDocuments({});

    // Fetch customers registered in the last 7 days
    const customersLast7Days = await User.find({
      registeredAt: { $gte: sevenDaysAgo, $lte: new Date() },
    });

    // Calculate frequency of customers per day for the last 7 days
    const dailyFrequencies = [];

    const labels = []
    const values = []

    for (let i = 0; i < 7; i++) {
      const dayStart = startOfDay(new Date(now.setDate(now.getDate() - 6 + i)));
      const dayEnd = endOfDay(new Date(now.setDate(now.getDate() - 6 + i)));

      labels.push(dayStart.toDateString());
      values.push(await User.countDocuments({
        registeredAt: { $gte: dayStart, $lte: dayEnd },
      }));

    }

    // Fetch customers registered yesterday
    const yesterdayStart = startOfDay(new Date(now.setDate(now.getDate() - 1)));
    const yesterdayEnd = endOfDay(new Date(now.setDate(now.getDate())));
    const customersYesterday = await User.countDocuments({
      registeredAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });

    // Fetch customers registered the day before yesterday
    const dayBeforeYesterdayStart = startOfDay(new Date(now.setDate(now.getDate() - 1)));
    const dayBeforeYesterdayEnd = endOfDay(new Date(now.setDate(now.getDate())));
    const customersDayBeforeYesterday = await User.countDocuments({
      registeredAt: { $gte: dayBeforeYesterdayStart, $lte: dayBeforeYesterdayEnd },
    });

    // Calculate the trend and trend number
    const trend = customersYesterday - customersDayBeforeYesterday >= 0 ? "up" : "down";
    const trendNumber = customersYesterday - customersDayBeforeYesterday;

    // Response structure
    const customerStatistics = {
      totalCustomers,
      customersLast7Days: customersLast7Days.length,
      dailyFrequencies: { labels, values },
      trend,
      trendNumber,
    };

    // ---- Order Section ----
    // Fetch total sales
    const totalSales = await Order.countDocuments({});

    // Calculate sales for the last 7 days, excluding today
    const salesLast7Days = {
      labels: [],
      values: []
    };

    for (let i = 1; i <= 7; i++) {  // Starting from 1, excluding today
      const dayStart = startOfDay(new Date(now.setDate(now.getDate() - i)));
      const dayEnd = endOfDay(new Date(now.setDate(now.getDate() - i)));

      salesLast7Days.labels.push(dayStart.toDateString());
      // Sum of total sales for each day (total sales value for that day)
      const dailySales = await Order.aggregate([
        { $match: { createdAt: { $gte: dayStart, $lte: dayEnd } } },
        { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
      ]);
      salesLast7Days.values.push(dailySales.length > 0 ? dailySales[0].totalSales : 0);
    }

    const orderStatistics = {
      totalSales,
      salesLast7Days,
    };

    // Final response combining both customer and order statistics
    res.status(200).json({
      status: "success",
      data: { customerStatistics, orderStatistics }
    });

    res.status(200).json({ status: "success", data: customerStatistics });
  } catch (error) {
    console.error(error);
    next(error)
  }
};


// Utility function to generate dynamic date labels (Yesterday, Today, Tomorrow, etc.)
const getDynamicDateLabels = () => {
  const today = moment();  // Get today's date using moment.js
  const labels = {};

  // Generate labels for Yesterday, Today, Tomorrow, and the next 7 days
  for (let i = -1; i <= 7; i++) {
    const dateLabel = today.clone().add(i, "days").format("DD.MM.YYYY");
    const label =
      i === -1
        ? "Yesterday"
        : i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : dateLabel;

    labels[label] = []; // Initialize the array for each label
  }

  return labels;
};


const createJobBoardData = async (req, res, next) => {
  try {
    // Fetch all the order statuses that should be used on the job board
    const orderStatuses = await OrderStatus.find({ useOnJobBoard: true });

    // If no valid order statuses are found
    if (orderStatuses.length === 0) {
      return res.status(404).json({ message: "No order statuses found for job board." });
    }

    // Fetch all orders at once
    const orders = await Order.find().populate('status').exec();

    console.log(`Total Orders Found: ${orders.length}`);

    // Initialize the result array
    let result = [];

    // Loop through each valid order status
    for (let status of orderStatuses) {
      // Filter orders that match the current order status
      const filteredOrders = orders.filter(order => {
        return order.status && order.status._id.toString() === status._id.toString();
      });

      console.log(`Number of Orders ${filteredOrders.length} found for Status: ${status.statusTitle}`);

      // Initialize the status object with dynamic date labels
      const statusData = {
        status: status.statusTitle,
        color: status.colorClass,
        dates: getDynamicDateLabels(), // Initialize dates dynamically
      };


      // Iterate through filtered orders and group them by date labels
      for (let order of filteredOrders) {
        console.log(`Processing Order ${order._id} with Invoice No: ${order.invoiceNo}`);

        let matched = false;

        // Iterate over cart items and their shipping items
        for (let item of order.cartItems) {
          for (let shippingItem of item.shipping.shipments) {
            const productionDate = moment(shippingItem.shippingDates.productionDate).format("MM.DD.YYYY");

            console.log(`ProductionDate: ${productionDate} for Order Invoice: ${order.invoiceNo}`);

            // Check if the order date matches any dynamic date label
            for (const label in statusData.dates) {
              const labelDate = moment(label, "DD.MM.YYYY").format("MM.DD.YYYY");

              console.log(`Checking Label: ${labelDate} for Order Invoice: ${order.invoiceNo}`);

              if (productionDate === labelDate) {
                statusData.dates[label].push(order._id);
                matched = true;
                break; // Exit once we find a match
              }
            }

            if (matched) break; // Exit once we find a match
          }

          if (matched) break; // Exit once we find a match
        }

        // If the order doesn't match any date label, put it in "Past Orders"
        // if (!matched) {
        //   statusData.dates["Past Orders"].push(order._id);
        // }
      }

      // Add the populated status data to the result array
      result.push(statusData);
    }

    // Return the result as a JSON response
    return res.status(200).json({ data: result });
  } catch (error) {
    // Handle any errors
    console.error(error);
    next(error)
  }
};

const fetchLogs = async (req, res, next) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ status: "success", data: logs });
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const addNewQuery = async (req, res, next) => {
  try {
    const alreadyQuery = await Query.findOne({ question: req.body.question });
    if (alreadyQuery) {
      return res.status(400).json({ status: "failed", message: "This question already exists" });
    }
    const newQuery = await new Query({
      question: req.body.question,
      answer: he.decode(req.body?.answer),
      category: req.body.category,
    }).save();

    res
      .status(200)
      .json({ status: "success", message: "Query Created Successfully", data: newQuery });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllQueries = async (req, res, next) => {
  try {
    const allQueries = await Query.find({}).populate("category");
    res.status(200).json({ status: "success", data: allQueries });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getQueryDetail = async (req, res, next) => { 
  try {
    const query = await Query.findById(req.params.id).populate("category");

    console.log("Query: ", query)

    if (!query) {
      return res.status(400).json({ message: "Query not found" });
    }
    res.status(200).json({ status: "success", data: query });
  } catch (error) {
    console.error(error);
    next(error)
  }
 }

 const updateQueryDetail = async (req, res, next) => {
  try {

    console.log("Update Query: ", req.body);

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(400).json({ message: "Query not found" });
    }


    query.question = req.body.question;
    query.answer = he.decode(req.body?.answer);
    query.category = req.body.category;

    await query.save();

    res.status(200).json({ status: "success", message: "Query Updated Successfully", data: query });

    await createLog(`Query is updated of question '${query.question}' by ${req.user.name}`);
  } catch (error) {
    console.error(error);
    next(error)
  }
 }

const deleteQuery = async (req, res, next) => {
  try {
    const deletedQuery = await Query.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Query Deleted Successfully" });

    await createLog(`Query is deleted of question '${deleteQuery.question}' by ${req.user.name}`);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

function convertHtmlToPdf(htmlContent, outputPath) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlContent).toFile(outputPath, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


const sendEmailToIndividualUser = async (req, res, next) => {
  try {

    const OrderData = await Order.findById(req.body.id)
      .populate("userId") // Populating the user associated with the order
      .populate("status")
      .populate("cartItems.shipping.shipments.sets.status")
      .exec();

    console.log("Order: ", OrderData)


    const settings = await Settings.findOne();
    const htmlContent = sendOrderEmailTemplate(OrderData, settings);
    const pdfPath = `/public/uploads/temp/${OrderData._id}.pdf`;

    await convertHtmlToPdf(htmlContent, pdfPath);

    const attachments = [
      {
        filename: `${OrderData._id}.pdf`,
        path: pdfPath,
        contentType: "application/pdf",
      },
    ];
    const messageContent = sendResendInvoiceEmailTemplate(OrderData, settings);
    await sendEmail(
      req.body.email,
      `Resending: Order Invoice #${req.body.id}`,
      // `<div>
      //   <h3>Hello Dear ${OrderData.userId.firstName + " " + OrderData.userId.lastName},</h3>
      //   <p>
      //     As requested, we are resending a copy of your invoice for order #${req.body.id} placed with Designprint NYC.
      //   </p>
      //   <p>
      //     You can view and manage your order by 
      //     <a href="https://signanddesignstudio.com/login" target="_blank">logging into your account</a>. 
      //     If you have any questions, please don't hesitate to contact us at 
      //     <a href="mailto:signanddesignstudio@gmail.com">signanddesignstudio@gmail.com</a>.
      //   </p>
      //   <p>
      //     Thank you for choosing Sign and Design Studio. We appreciate your business!
      //   </p>
      //   <p>Best regards,<br/>The Sign and Design Studio Team</p>
      // </div>`,
      messageContent,
      attachments
    );



    res.status(200).json({ status: true });

    // const result = await sendEmail(
    //   req.body.email,
    //   req.body.subject,
    //   sendEmailToIndividualUserTempate(he.decode(req.body?.description))
    // );

    // const newEmailSent = new email({
    //   receiver: req.body.email,
    //   subject: req.body.subject,
    //   message: sendEmailToIndividualUserTempate(he.decode(req.body?.description)),
    //   sendingStatus: result.success,
    // });

    // await newEmailSent.save();

    // await createLog(
    //   `Email of subject ${req.body.subject} is send to ${req.body.email} by ${req.user.name}`
    // );

    // if (result.success) {
    //   res.status(200).json({ message: "Email Sent Successfully" });
    // } else {
    //   res.status(400).json({ message: result.error });
    // }





  } catch (error) {
    console.error(error);
    next(error)
  }
};

const sendEmailToUser = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    const htmlContent =sendEmailToIndividualUserTempate(req.body, settings)
    const emailToBeSend = await sendEmail(req.body.email, req.body.subject, htmlContent, [])

    if (emailToBeSend.success) {
      res.status(200).json({ message: "Email Sent Successfully" });
    }
    else {
      res.status(400).json({ message: emailToBeSend.error });
    }

  }
  catch (error) {
    console.error(error);
    next(error)
  }
}

const getAllSentEmails = async (req, res, next) => {
  try {
    const allEmails = await email.find({});
    res.status(200).json({ status: "success", data: allEmails });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getAllWebsiteCustomerList = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({ message: "No Customers Data found" });
    }
    console.log("Users: ", users);
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const markAccountAsClosed = async (req, res, next) => {
  try {

    const user = await User.findOneAndUpdate({ _id: req.body.id }, {
      accountStatus: "closed"
    });

    if (user) {
      res.status(200).json({ message: "Account Closed Successfully" });
      await createLog(`User with ID ${req.body.id} is marked as Closed by ${req.user.name}`);
    }
    else {
      return res.status(400).json({ message: "User not found." });
    }

  } catch (error) {
    console.error(error);
    next(error)
  }

}

const markAsAdminThisUser = async (req, res, next) => {
  try {

    const user = await User.findOneAndUpdate({ _id: req.body.id }, {
      isAdmin: !req.body.status
    });

    if (user) {
      res.status(200).json({ message: "Account Marked As Successfully" });
      // await createLog(`User with ID ${req.body.id} is marked as Closed by ${req.user.name}`);
    }
    else {
      return res.status(400).json({ message: "User not found." });
    }

  } catch (error) {
    console.error(error);
    next(error)
  }

}

function formatStringForEventPath(input) {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^a-z_]/g, ""); // Remove non-alphabetic characters except underscores
}

const addNewCustomEvent = async (req, res, next) => {
  try {
    const checkIfSameEventAlreadyRegisterd = await CustomEvent.findOne({
      eventName: req.body.eventName,
    });

    if (checkIfSameEventAlreadyRegisterd) {
      return res.status(400).json({ message: "Event with the same name already exists." });
    }

    const eventPathName = formatStringForEventPath(req.body.eventName);

    const newEvent = await new CustomEvent({
      eventName: req.body.eventName,
      eventPathName: eventPathName,
      eventDescription: he.decode(req.body.eventDescription),
      tagLineAboutPromotion: he.decode(req.body.tagLineAboutPromotion),
      eventDate: req.body.eventDate,
      eventTelephone: req.body.eventTelephone,
      eventEmail: req.body.eventEmail,
      eventAddress: req.body.eventAddress,
      organizerTagLine: he.decode(req.body.organizerTagLine),
      eventPromotionDiscount: he.decode(req.body.eventPromotionDiscount)
    }).save();

    await createLog(`New event is created with name '${newEvent.eventName}' by ${req.user.name}`);

    res.status(200).json({ message: "Event created successfully." });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const deleteCustomEvent = async (req, res, next) => {
  try {
    const deletedEvent = await CustomEvent.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Event deleted successfully." });

    await createLog(`Event with id ${deletedEvent._id} is deleted by ${req.user.name}`);
    // Delete all orders related to this event
    // await Order.deleteMany({ eventId: deletedEvent._id });

    // Delete all reviews related to this event
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const listAllCustomEvents = async (req, res, next) => {
  try {
    const events = await CustomEvent.find({});
    if (!events) {
      return res.status(400).json({ message: "No events found" });
    }
    res.status(200).json({ data: events });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateCustomEventStatus = async (req, res, next) => {
  try {
    const updatedCustomEvent = await CustomEvent.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedCustomEvent) {
      return res.status(404).json({ message: "Custom Event not found" });
    }
    await createLog(
      `User status is updated to ${updatedCustomEvent.status} for Custom Event with name ${updatedCustomEvent.eventName} by ${req.user.name}`
    );
    res
      .status(200)
      .json({ message: "Custom Event status updated successfully", data: updatedCustomEvent });
    // Send email notification to user
    // sendEmail(updatedUser.email, "User Status Updated", `Your status has been updated to ${updatedUser.status}`);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateLogoForCustomEvent = async (req, res, next) => {
  try {
    const logo = req.files[0].destination + req.files[0].filename;

    const updatedCustomEvent = await CustomEvent.findByIdAndUpdate(
      req.params.id,
      { eventLogo: logo },
      { new: true }
    );
    if (!updatedCustomEvent) {
      return res.status(404).json({ message: "Custom Event not found" });
    }
    await createLog(
      `Logo is updated for Custom Event with name ${updatedCustomEvent.eventName} by ${req.user.name}`
    );
    res.status(200).json({ message: "Logo updated successfully", data: updatedCustomEvent });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateBackgroundImageForCustomEvent = async (req, res, next) => {
  try {
    const backgroundImage = req.files[0].destination + req.files[0].filename;

    const updatedCustomEvent = await CustomEvent.findByIdAndUpdate(
      req.params.id,
      { backgroundImage: backgroundImage },
      { new: true }
    );
    if (!updatedCustomEvent) {
      return res.status(404).json({ message: "Custom Event not found" });
    }
    await createLog(
      `Background Image is updated for Custom Event with name ${updatedCustomEvent.eventName} by ${req.user.name}`
    );
    res
      .status(200)
      .json({ message: "Background Image updated successfully", data: updatedCustomEvent });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const updateCustomEventDetail = async (req, res, next) => {
  try {
    const eventPathName = formatStringForEventPath(req.body.eventName);

    const updatedCustomEvent = await CustomEvent.findByIdAndUpdate(
      req.params.id,

      {
        eventName: req.body.eventName,
        eventPathName: eventPathName,
        eventDescription: he.decode(req.body.eventDescription),
        tagLineAboutPromotion: he.decode(req.body.tagLineAboutPromotion),
        eventDate: req.body.eventDate,
        eventTelephone: req.body.eventTelephone,
        eventEmail: req.body.eventEmail,
        eventAddress: req.body.eventAddress,
        organizerTagLine: he.decode(req.body.organizerTagLine),
        eventPromotionDiscount: he.decode(req.body.eventPromotionDiscount)
      },
      { new: true }
    );
    if (!updatedCustomEvent) {
      return res.status(404).json({ message: "Custom Event not found" });
    }
    await createLog(
      `Custom Event details name ${updatedCustomEvent.name} are updated by ${req.user.name}`
    );
    res
      .status(200)
      .json({ message: "Custom Event details updated successfully", data: updatedCustomEvent });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const fetchSpecificCustomEventDetail = async (req, res, next) => {
  try {
    const event = await CustomEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Custom Event not found" });
    }
    res.status(200).json({ data: event });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const fetchSpecificCustomEventDetailByPathName = async (req, res, next) => {
  try {
    const event = await CustomEvent.findOne({ eventPathName: req.params.path });
    if (!event) {
      return res.status(404).json({ message: "Custom Event not found" });
    }
    res.status(200).json({ data: event });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  loginUser,
  getDashboardData,
  updateUserRole,
  addNewQuery,
  getAllQueries,
  deleteQuery,
  sendEmailToIndividualUser,
  getAllSentEmails,
  updatePassword,
  getAllWebsiteCustomerList,
  addNewCustomEvent,
  deleteCustomEvent,
  listAllCustomEvents,
  updateCustomEventStatus,
  updateLogoForCustomEvent,
  updateBackgroundImageForCustomEvent,
  updateCustomEventDetail,
  fetchSpecificCustomEventDetail,
  fetchSpecificCustomEventDetailByPathName,
  markAccountAsClosed,
  markAsAdminThisUser,
  createJobBoardData,
  getStatsForAdmin,
  fetchLogs,
  sendEmailToUser,
  getQueryDetail,
  updateQueryDetail
};
