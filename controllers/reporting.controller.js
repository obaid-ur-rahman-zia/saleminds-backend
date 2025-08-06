const Orders = require("../models/order.model")
const AdminUser = require("../models/adminUser.model");
const nodemailer = require("nodemailer");
const moment = require('moment'); // For handling date ranges
const config  = require("config");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Settings = require('../models/settings.model');
const {sendAdminPasswordResetTemplate} = require('../commons/emailTemplates');
const create_Customer_OrderSummary = async (req, res, next) => {
    try {
        console.log("Request Body: ", req.body);

        const { periodSelection, startDate, endDate } = req.body;

        if (!periodSelection) {
            return res.status(400).json({ message: "Time range selection is required." });
        }

        let filter = {};
        const now = moment();

        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }

        const orders = await Orders.find(filter)
            .populate("userId") // Populating the user associated with the order
            .exec();


        // Group orders by unique users
        const userOrderMap = orders.reduce((map, order) => {
            const userEmail = order.userId?.email || "unknown";
            if (!map[userEmail]) {
                map[userEmail] = {
                    customerDetail: {
                        name: order.userId?.firstName + " " + order.userId?.lastName || "Unknown", // Replace with actual customer name field if available
                        email: userEmail,
                    },
                    totalNumberOfOrders: 0,
                    totalPriceOfAllOrders: 0,
                    totalTax: 0,
                    totalShippingCharges: 0,
                    totalDiscount: 0,
                    totalAmount: 0,
                };
            }

            const userSummary = map[userEmail];
            userSummary.totalNumberOfOrders += 1;
            userSummary.totalPriceOfAllOrders = (
                parseFloat(userSummary.totalPriceOfAllOrders) +
                (order.cartTotal || 0)
            ).toFixed(2);

            let totalTax = 0

            order.cartItems.map((item, index) => {
                totalTax += Number(item.shipping.taxPrice)
            })



            userSummary.totalTax = (
                parseFloat(userSummary.totalTax) +
                (totalTax || 0)
            ).toFixed(2);
            userSummary.totalShippingCharges = (
                parseFloat(userSummary.totalShippingCharges) +
                (order.shippingCharges || 0)
            ).toFixed(2);
            userSummary.totalDiscount = (
                parseFloat(userSummary.totalDiscount) +
                ((order.coupon?.discount) || 0)
            ).toFixed(2);
            userSummary.totalAmount = (
                parseFloat(userSummary.totalAmount) +
                (order.grandTotal || 0)
            ).toFixed(2);


            return map;
        }, {});

        const orderSummary = Object.values(userOrderMap);

        orderSummary.forEach((item) => {
            item._id = Math.floor(Math.random() * 1000000); // Generate a random ID for each item
        });

        return res.status(200).json({ data: orderSummary });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

const create_Product_SalesSummary = async (req, res, next) => {
    try {

        console.log("Request Body: ", req.body);

        const { periodSelection, startDate, endDate, selectedProduct } = req.body;

        if (!periodSelection) {
            return res.status(400).json({ message: "Time range selection is required." });
        }

        let filter = {};
        const now = moment();

        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }


        const orders = await Orders.find(filter)
            .populate("cartItems.productId")
            .exec();

        // Initialize response array
        let transformedOrders = [];

        if (selectedProduct) {
            // Process only the selected product
            const productOrders = orders.filter(order =>
                order.cartItems.some(item => item.productId._id.toString() === selectedProduct)
            );

            if (productOrders.length === 0) {
                return res.status(404).json({ message: "No orders found for the selected product." });
            }

            let totalOrders = productOrders.length;
            let totalQuantity = 0;
            let totalRevenue = 0;
            let productName = "";

            productOrders.forEach(order => {
                order.cartItems.forEach(item => {
                    if (item.productId._id.toString() === selectedProduct) {
                        totalQuantity += Number(item.shipping.quantity);
                        totalRevenue += Number(item.total); // Assuming `price` is per unit
                        productName = item.productId.name;
                    }
                });
            });

            const avgQuantity = totalQuantity / totalOrders;
            const avgPrice = totalRevenue / totalQuantity;

            transformedOrders.push({
                productName,
                totalOrders,
                totalQuantity,
                avgQuantity,
                totalRevenue,
                avgPrice,
            });
        } else {
            // Process all unique products
            const productSummary = {};

            orders.forEach(order => {
                order.cartItems.forEach(item => {
                    const productId = item.productId._id.toString();

                    if (!productSummary[productId]) {
                        productSummary[productId] = {
                            productName: item.productId.name,
                            totalOrders: 1,
                            totalQuantity: 1,
                            totalRevenue: Number(item.total),
                        };
                    }

                    productSummary[productId].totalOrders += 1;
                    productSummary[productId].totalQuantity += 1;
                    productSummary[productId].totalRevenue += Number(item.total)
                });
            });

            // Convert productSummary object to array with aggregated metrics
            transformedOrders = Object.values(productSummary).map(product => ({
                ...product,
                avgQuantity: product.totalQuantity / product.totalOrders,
                avgPrice: product.totalRevenue / product.totalQuantity,
            }));
        }

        transformedOrders.forEach((item) => {
            item._id = Math.floor(Math.random() * 1000000); // Generate a random ID for each item
        });

        res.status(200).json({ data: transformedOrders });



    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const create_OrderSummary = async (req, res, next) => {
    try {
        const { periodSelection, startDate, endDate } = req.body;

        if (!periodSelection) {
            return res.status(400).json({ message: "Time range selection is required." });
        }

        let filter = {};
        const now = moment();

        // Apply the date filter based on the `periodSelection`
        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }

        // Fetch orders based on the filter
        const orders = await Orders.find(filter).lean().exec();

        // Initialize an object to hold the grouped results
        const groupedData = {};

        // Process each order
        orders.forEach((order) => {
            const groupKey = moment(order.createdOn).format("YYYY-MM-DD"); // Group by date
            if (!groupedData[groupKey]) {
                groupedData[groupKey] = {
                    period: groupKey,
                    paymentDate: order?.createdOn || groupKey, // Assuming paymentDate is optional
                    totalOrders: 0,
                    totalPrice: 0,
                    totalShipping: 0,
                    totalTaxPrice: 0,
                    total: 0,
                };
            }

            // Aggregate order data
            groupedData[groupKey].totalOrders += 1; // Increment the order count
            groupedData[groupKey].totalPrice += order?.grandTotal || 0; // Add cart total
            groupedData[groupKey].totalShipping += order?.shippingCost || 0; // Add shipping cost

            // Calculate the total tax price from cart items
            const taxFromCartItems = order.cartItems?.reduce(
                (sum, item) => sum + (item.shipping?.taxPrice || 0),
                0
            ) || 0;

            groupedData[groupKey].totalTaxPrice += taxFromCartItems; // Add tax price
            groupedData[groupKey].total += (order?.grandTotal || 0) + (order?.shippingCost || 0); // Add total
        });

        // Convert grouped data into an array of objects
        const result = Object.values(groupedData);

        // add random id in this object of each result

        result.forEach((item) => {
            item._id = Math.floor(Math.random() * 1000000); // Generate a random ID for each item
        });

        // Return the transformed response
        res.status(200).json({ data: result });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

const create_Order_DetailsSummary = async (req, res, next) => {
    try {
        const { periodSelection, startDate, endDate } = req.body;

        if (!periodSelection) {
            return res.status(400).json({ message: "Time range selection is required." });
        }

        let filter = {};
        const now = moment();

        // Apply the date filter based on the `periodSelection`
        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }

        // Fetch orders based on the filter
        const orders = await Orders.find(filter)
            .populate("userId") // Assuming userId is populated from a User model
            .populate("cartItems.productId") // Populate product details in cartItems
            .lean()
            .exec();

        // Map the orders into the required structure
        const result = orders.map((order) => ({
            orderNo: order?.invoiceNo || "Unknown",
            customerDetail: {
                name: order.userId
                    ? `${order.userId.firstName || ""} ${order.userId.lastName || ""}`.trim()
                    : "Unknown",
                email: order.userId?.email || "Unknown",
            },
            paymentDate: order?.createdOn || "Unknown",
            period: moment(order.createdOn).format("YYYY-MM-DD"),
            totalPrice: order?.grandTotal || 0,
            totalShipping: order?.shippingCost || 0,
            totalTaxPrice: order.cartItems?.reduce(
                (sum, item) => sum + (item.shipping?.taxPrice || 0),
                0
            ) || 0,
            total: (order?.grandTotal || 0) + (order?.shippingCost || 0),
            productDetail: order.cartItems?.map((item) => ({
                name: item.productId?.name || "Unknown Product",
                quantity: item.quantity || 0,
                price: item.price || 0,
            })) || [],
        }));

        result.forEach((item) => {
            item._id = Math.floor(Math.random() * 1000000); // Generate a random ID for each item
        });

        // Return the transformed response
        res.status(200).json({ data: result });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

const create_Order_Product_DetailSummary = async (req, res, next) => {
    try {
        const { periodSelection, startDate, endDate, selectedProduct } = req.body;

        if (!periodSelection) {
            return res.status(400).json({ message: "Time range selection is required." });
        }

        let filter = {};
        const now = moment();

        // Apply the date filter based on the `periodSelection`
        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }

        // Fetch orders based on the filter
        const orders = await Orders.find(filter)
            .populate("userId") // Assuming userId is populated from a User model
            .populate("cartItems.productId") // Populate product details in cartItems
            .lean()
            .exec();

        // Map the orders into the required structure
        const result = orders.map((order) => {

            const filteredProducts = order.cartItems?.filter((item) => {
                if (!selectedProduct || selectedProduct === "") {
                    return true; // Include all products if no filter is applied
                }
                return selectedProduct === item.productId?._id.toString();
            });

            return {
                orderNo: order?.invoiceNo || "Unknown",
                customerDetail: {
                    name: order.userId
                        ? `${order.userId.firstName || ""} ${order.userId.lastName || ""}`.trim()
                        : "Unknown",
                    email: order.userId?.email || "Unknown",
                },
                paymentDate: order?.createdOn || "Unknown",
                period: moment(order.createdOn).format("YYYY-MM-DD"),
                totalPrice: order?.grandTotal || 0,
                totalShipping: order?.shippingCost || 0,
                totalTaxPrice: filteredProducts?.reduce(
                    (sum, item) => sum + (item.shipping?.taxPrice || 0),
                    0
                ) || 0,
                total: (order?.grandTotal || 0) + (order?.shippingCost || 0),
                productDetail: filteredProducts?.map((item) => ({
                    name: item.productId?.name || "Unknown Product",
                    quantity: item.shipping?.quantity || 0,
                    additionalOption: item.product,
                    price: item.total || 0,
                })) || [],
            };
        });

        // Filter out orders with no product details (if selectedProduct was applied and no match found)
        const filteredResult = result.filter(order => order.productDetail.length > 0);

        filteredResult.forEach((item) => {
            item._id = Math.floor(Math.random() * 1000000); // Generate a random ID for each item
        });

        // Return the transformed response
        res.status(200).json({ data: filteredResult });
    } catch (error) {
        console.error(error);
        next(error)
    }
};


const create_ShippingSummary = async (req, res, next) => {
    try {

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const create_TaxSummary = async (req, res, next) => {
    try {
        const { periodSelection, startDate, endDate } = req.body;

        if (!periodSelection) {
            return res.status(400).json({ message: "Time range selection is required." });
        }

        let filter = {};
        const now = moment();

        // Apply the date filter based on the `periodSelection`
        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }

        // Fetch orders based on the filter
        const orders = await Orders.find(filter)
            .populate("cartItems.productId") // Populate product details in cartItems
            .lean()
            .exec();

        // Group tax collected and number of orders by day
        const taxSummary = {};

        orders.forEach((order) => {
            const dayKey = moment(order.createdOn).format("YYYY-MM-DD");

            if (!taxSummary[dayKey]) {
                taxSummary[dayKey] = {
                    date: dayKey,
                    totalTaxCollected: 0,
                    totalOrders: 0,
                };
            }

            // Increment order count for the day
            taxSummary[dayKey].totalOrders += 1;

            // Calculate tax for the order and add it to the total
            const orderTax = order.cartItems?.reduce(
                (sum, item) => sum + (item.shipping?.taxPrice || 0),
                0
            ) || 0;

            taxSummary[dayKey].totalTaxCollected += orderTax;
        });

        // Convert the summary object to an array
        const result = Object.values(taxSummary);

        result.forEach((item) => {
            item._id = Math.floor(Math.random() * 1000000); // Generate a random ID for each item
        });

        // Return the result
        res.status(200).json({ data: result });
    } catch (error) {
        console.error(error);
        next(error)
    }
};


const create_CouponSummary = async (req, res, next) => {
    try {
        const { periodSelection, startDate, endDate, couponType } = req.body;

        // Build the filter for the query
        const filter = { "coupon.code": { $exists: true } };

        // Add the coupon type filter if provided
        if (couponType) {
            filter["coupon.discountType"] = couponType;
        }

        // Apply the date range filter based on the `periodSelection`
        const now = moment();
        if (periodSelection === "custom") {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for custom selection." });
            }
            filter.createdOn = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const predefinedRanges = {
                today: [now.startOf("day").toDate(), now.endOf("day").toDate()],
                yesterday: [now.subtract(1, "day").startOf("day").toDate(), now.endOf("day").toDate()],
                this_week: [now.startOf("week").toDate(), now.endOf("week").toDate()],
                last_week: [now.subtract(1, "week").startOf("week").toDate(), now.endOf("week").toDate()],
                this_month: [now.startOf("month").toDate(), now.endOf("month").toDate()],
                last_month: [now.subtract(1, "month").startOf("month").toDate(), now.endOf("month").toDate()],
                this_year: [now.startOf("year").toDate(), now.endOf("year").toDate()],
            };

            const range = predefinedRanges[periodSelection];
            if (!range) {
                return res.status(400).json({ message: "Invalid time range selection." });
            }
            filter.createdOn = { $gte: range[0], $lte: range[1] };
        }

        // Fetch orders with coupon details
        const orders = await Orders.find(filter)
            .populate("coupon") // Populate coupon if it's a reference
            .lean()
            .exec();

        if (!orders.length) {
            return res.status(200).json({ data: [], message: "No orders with voucher usage found." });
        }

        // Group voucher usage details
        const voucherUsageSummary = {};

        orders.forEach((order) => {
            const { coupon, userId, grandTotal } = order;

            if (!coupon || !coupon.code) return;

            const voucherCode = coupon.code;

            if (!voucherUsageSummary[voucherCode]) {
                voucherUsageSummary[voucherCode] = {
                    code: voucherCode,
                    discountType: coupon.discountType,
                    totalOrders: 0,
                    totalUsers: new Set(),
                    totalDiscount: 0,
                    totalAfterPrice: 0,
                };
            }

            // Calculate discount and after price
            let discount = 0;
            if (coupon.discountType === "amount") {
                discount = coupon.discountAmount;
            } else if (coupon.discountType === "percentage") {
                discount = (grandTotal || 0) * (coupon.discountPercentage / 100);
            }

            const afterPrice = (grandTotal || 0) - discount;

            // Update the summary
            voucherUsageSummary[voucherCode].totalOrders += 1;
            voucherUsageSummary[voucherCode].totalUsers.add(userId?.toString());
            voucherUsageSummary[voucherCode].totalDiscount += discount;
            voucherUsageSummary[voucherCode].totalAfterPrice += afterPrice;
        });

        // Convert the summary object into an array
        const result = Object.values(voucherUsageSummary).map((summary) => ({
            _id : Math.floor(Math.random() * 1000000),
            code: summary.code,
            discountType: summary.discountType,
            totalOrders: summary.totalOrders,
            totalUsers: summary.totalUsers.size, // Convert Set size to number
            totalDiscount: summary.totalDiscount,
            totalAfterPrice: summary.totalAfterPrice,
        }));

  

        // Return the result
        res.status(200).json({ data: result });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      console.log("1. Starting password reset for email:", email);
  
      if (!email) {
        return res.status(400).json({
          status: "failed",
          message: "Email is required",
        });
      }
  
      // Find user
      const user = await AdminUser.findOne({ email });
      console.log("2. User found:", user ? "Yes" : "No");
  
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "No user found with this email address",
        });
      }
      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user._id },
        config.get('v1.JWT_SECRET'),
        { expiresIn: "1h" }
      );
      console.log("3. Reset token generated");
  
      try {
        // Update user with reset token
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        console.log("4. User updated with reset token");
  
        // Log all email-related environment variables
        console.log("5. Email Configuration:", {
          host: config.get("v1.EMAIL_HOST_SERVER"),
          port: config.get("v1.EMAIL_PORT"),
          user: config.get("v1.EMAIL_USERNAME"),
          resetUrl: config.get("v1.RESET_URL"),
          // Don't log the password
        });
  
        const transporter = nodemailer.createTransport({
          host: config.get("v1.EMAIL_HOST_SERVER"),
          port: parseInt(config.get("v1.EMAIL_PORT")),
          secure: true,
          auth: {
            user:config.get("v1.EMAIL_USERNAME"),
            pass: config.get("v1.EMAIL_PASSWORD"),
          },
          tls: {
            rejectUnauthorized: false,
          },
          debug: true,
        });
  
        console.log("6. Transporter created");
  
        // Test connection
        try {
          await transporter.verify();
          console.log("7. Email configuration verified successfully");
        } catch (verifyError) {
          console.error("Email verification failed:", verifyError);
          throw verifyError;
        }
        const settings = await Settings.findOne();
        const resetUrl = `${config.get("v1.RESET_URL")}/reset-password/${resetToken}`;
        const htmlContent = sendAdminPasswordResetTemplate(user.name, resetUrl, settings);
        console.log("8. Reset URL created:", resetUrl);
  
        const mailOptions = {
          from: config.get('v1.EMAIL_USERNAME'),
          to: user.email,
          subject: "Password Reset Request",
          html: htmlContent
        };
        console.log("9. Mail options prepared");
  
        await transporter.sendMail(mailOptions);
        console.log("10. Email sent successfully");
  
        return res.status(200).json({
          status: "success",
          message: "Password reset link sent to your email",
        });
      } catch (emailError) {
        console.error("Detailed email error:", {
          message: emailError.message,
          stack: emailError.stack,
          code: emailError.code,
          command: emailError.command,
        });
  
        // Cleanup token if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
  
        return res.status(500).json({
          status: "failed",
          message: "Failed to send reset email. Please try again later.",
          debug: emailError.message, 
        });
      }
    } catch (error) {
      console.error("Main error:", {
        message: error.message,
        stack: error.stack,
      });
      return res.status(500).json({
        status: "failed",
        message: "An unexpected error occurred",
        debug: error.message, 
      });
    }
  };

  const validateResetToken = async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await AdminUser.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "Password reset token is invalid or has expired",
        });
      }
  
      res.status(200).json({
        status: "success",
        message: "Token is valid",
      });
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(500).json({
        status: "failed",
        message: "Error validating reset token",
      });
    }
  };

//   const resetPassword = async (req, res) => {
//     try {
//       const { token } = req.params;
//       const { password } = req.body;
  
//       if (!password) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Password is required",
//         });
//       }
  
//       // Find user with valid reset token and not expired
//       const user = await AdminUser.findOne({
//         resetPasswordToken: token,
//         resetPasswordExpires: { $gt: Date.now() },
//       });
  
//       if (!user) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Password reset token is invalid or has expired",
//         });
//       }
  
//       // Hash new password
//       const salt = await bcrypt.genSalt(Number(process.env.SALT));
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       // Update user's password and clear reset token fields
//       user.password = hashedPassword;
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;
  
//       await user.save();
  
//       await createLog(`Password reset completed for user: ${user.email}`);
  
//       res.status(200).json({
//         status: "success",
//         message: "Password has been reset successfully",
//       });
//     } catch (error) {
//       console.error("Reset password error:", error);
//       res.status(500).json({
//         status: "failed",
//         message: "Error resetting password",
//         error: process.env.NODE_ENV === "development" ? error.message : undefined,
//       });
//     }
//   };

// const resetPassword = async (req, res) => {
//     try {
//       const { token } = req.params;
//       const { password } = req.body;
//       const currentTime = Date.now(); // Get current time once for consistency
//       const currentUTCDate = new Date(currentTime); // For clearer comparison if needed
  
//       console.log("\n--- Reset Password Attempt ---");
//       console.log(`Timestamp: ${new Date().toISOString()}`);
//       console.log("Received Token (from URL params):", token);
//       console.log("Current Server Time (ms UTC):", currentTime);
//       console.log(`Current Server Time (Date): ${currentUTCDate.toISOString()}`);
  
//       // Basic validation
//       if (!password) {
//         console.log("Validation Failed: Password is required.");
//         return res.status(400).json({
//           status: "failed",
//           message: "Password is required",
//         });
//       }
//       if (typeof password !== 'string' || password.length < 8) {
//          console.log("Validation Failed: Password does not meet length requirement.");
//          // You might want to add more specific validation messages here
//          return res.status(400).json({
//            status: "failed",
//            message: "Password must be a string and at least 8 characters long.",
//          });
//       }
  
  
//       // Log the query being performed
//       console.log("Querying for AdminUser with:");
//       console.log("  resetPasswordToken:", token);
//       console.log(`  resetPasswordExpires > ${currentTime} (${currentUTCDate.toISOString()})`);
  
//       // Find user with valid reset token AND not expired
//       const user = await AdminUser.findOne({
//         resetPasswordToken: token,
//         resetPasswordExpires: { $gt: currentTime }, // Compare against the consistent timestamp
//       });
  
//       // --- Diagnosis Logic ---
//       if (!user) {
//         console.log("Primary User Lookup Failed (Token invalid or expired).");
//         console.log("--> Performing secondary check: Searching by token only...");
  
//         // Try finding by token *only* to see if it's an expiry issue vs. token not found at all
//         const userByTokenOnly = await AdminUser.findOne({ resetPasswordToken: token });
  
//         if (userByTokenOnly) {
//           console.log(`--> Secondary Check Result: User found by token (${userByTokenOnly.email}). This means the token exists but is likely expired or already used.`);
//           const storedExpiry = userByTokenOnly.resetPasswordExpires;
//           if (storedExpiry) {
//               const storedExpiryTime = storedExpiry.getTime();
//               const storedExpiryDate = new Date(storedExpiryTime);
//               console.log(`    Stored Expiry Time (ms UTC): ${storedExpiryTime}`);
//               console.log(`    Stored Expiry Time (Date):   ${storedExpiryDate.toISOString()}`);
//               console.log(`    Is Stored Expiry > Current Time? ${storedExpiryTime > currentTime}`);
//           } else {
//                console.log("    Stored Expiry Time: Not found (token might have been cleared after use).");
//           }
  
//         } else {
//           console.log("--> Secondary Check Result: No user found matching the token at all.");
//         }
  
//         // Return the original error message as perceived by the user
//         return res.status(400).json({
//           status: "failed",
//           message: "Password reset token is invalid or has expired", // Keep user-facing message generic
//         });
//       }
//       // --- End Diagnosis Logic ---
  
  
//       // If user is found by the primary query (token valid and not expired)
//       const storedExpiryTime = user.resetPasswordExpires.getTime();
//       const storedExpiryDate = new Date(storedExpiryTime);
//       console.log(`Primary User Lookup Success: User found (${user.email}).`);
//       console.log(`  Stored Expiry Time (ms UTC): ${storedExpiryTime}`);
//       console.log(`  Stored Expiry Time (Date):   ${storedExpiryDate.toISOString()}`);
//       console.log("Proceeding with password reset...");
  
  
//       // Hash new password
//       const salt = await bcrypt.genSalt(Number(process.env.SALT));
//       const hashedPassword = await bcrypt.hash(password, salt);
//       console.log(`Password hashed for user: ${user.email}`);
  
//       // Update user's password and clear reset token fields
//       user.password = hashedPassword;
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;
  
//       await user.save();
//       console.log(`User document updated and saved for: ${user.email}. Token fields cleared.`);
  
//       // Optional: Log the action
//       try {
//           await createLog(`Password reset completed via token for user: ${user.email}`);
//       } catch (logError) {
//           console.error("Error creating log entry:", logError);
//           // Don't fail the whole request if logging fails
//       }
  
  
//       console.log(`Password reset successful for: ${user.email}. Sending success response.`);
//       res.status(200).json({
//         status: "success",
//         message: "Password has been reset successfully",
//       });
  
//     } catch (error) {
//       // Log the FULL error object for detailed debugging
//       console.error("!!! Critical Error during Reset Password Process !!!:", error);
//       res.status(500).json({
//         status: "failed",
//         message: "Error resetting password",
//         // Only include detailed error message in development for security
//         error: process.env.NODE_ENV === "development" ? error.message : undefined,
//       });
//     }
//   };
  
  
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const currentTime = Date.now(); // Use a consistent time for checks
    const currentUTCDate = new Date(currentTime);
  
    console.log("\n--- Reset Password Attempt ---");
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("Received Token (from URL params):", token);
    console.log("Received New Password (length):", password ? password.length : 'Not provided'); // Don't log the actual password
    console.log("Current Server Time (ms UTC):", currentTime);
    console.log(`Current Server Time (Date): ${currentUTCDate.toISOString()}`);
  
    // --- Input Validation ---
    if (!password) {
      console.log("Validation Failed: Password is required in the request body.");
      return res.status(400).json({
        status: "failed",
        message: "Password is required",
      });
    }
    // Add any other password validation rules you have (e.g., length)
    if (typeof password !== 'string' || password.length < 8) {
       console.log("Validation Failed: Password does not meet length requirement (min 8 chars).");
       return res.status(400).json({
         status: "failed",
         message: "Password must be at least 8 characters long.",
       });
    }
  
    try {
      // --- Find User by Valid Token and Expiry ---
      console.log("Querying for AdminUser with:");
      console.log("  resetPasswordToken:", token);
      console.log(`  resetPasswordExpires > ${currentTime} (${currentUTCDate.toISOString()})`);
  
      const user = await AdminUser.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: currentUTCDate }, // Compare against Date object or timestamp
      });
  
      // --- Handle User Not Found (Invalid Token or Expired) ---
      if (!user) {
        console.log("Primary User Lookup Failed (Token invalid or expired).");
        // Optional: Add secondary check again if needed for detailed diagnosis, but main goal is the 400 response.
        console.log("--> Checking if token exists but is expired/cleared...");
        const userByTokenOnly = await AdminUser.findOne({ resetPasswordToken: token });
         if (userByTokenOnly) {
           console.log(`--> Secondary Check Result: User found (${userByTokenOnly.email}), meaning token exists but is expired or DB expiry check failed.`);
           const storedExpiry = userByTokenOnly.resetPasswordExpires;
           if (storedExpiry) {
               console.log(`    Stored Expiry (Date): ${storedExpiry.toISOString()}`);
               console.log(`    Is Stored Expiry > Current Time? ${storedExpiry.getTime() > currentTime}`);
           } else {
               console.log("    Stored Expiry Time: Not set (likely cleared).");
           }
         } else {
           console.log("--> Secondary Check Result: No user found matching the token string at all.");
         }
  
        return res.status(400).json({
          status: "failed",
          message: "Password reset link is invalid or has expired. Please request a new one.", // User-friendly message
        });
      }
  
      // --- User Found - Proceed with Reset ---
      console.log(`Primary User Lookup Success: User found (${user.email}).`);
      console.log(`  Stored Expiry (Date): ${user.resetPasswordExpires.toISOString()}`);
      console.log("Proceeding with password hashing and update...");
  
      // 1. Hash New Password
      let hashedPassword;
      try {
        // Ensure SALT is a number for bcrypt.genSaltSync
        const saltRounds = Number(config.get('v1.SALT'));
        if (isNaN(saltRounds)) {
            console.error("!!! Configuration Error: process.env.SALT is not a valid number.");
            throw new Error("Server configuration error hashing password."); // Generic error
        }
        const salt = await bcrypt.genSalt(saltRounds);
        hashedPassword = await bcrypt.hash(password, salt);
        console.log(`Password successfully hashed for user: ${user.email}`);
      } catch (hashError) {
        console.error("!!! Error during password hashing !!!:", hashError);
        // Throw the error to be caught by the main catch block, sending a 500 response
        throw new Error("Failed to process new password.");
      }
  
  
      // 2. Update User Document Fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined; // Clear the token
      user.resetPasswordExpires = undefined; // Clear the expiry
  
      // 3. Save Updated User to Database
      await user.save(); // This operation can fail (DB connection, validation hooks, etc.)
      console.log(`User document updated and saved successfully for: ${user.email}. Token fields cleared.`);
  
      // 4. Optional: Log the successful action
      try {
        await createLog(`Password reset completed successfully via token for user: ${user.email}`);
      } catch (logError) {
        // Log the error but don't fail the request if logging fails
        console.error("Error creating log entry after successful password reset:", logError);
      }
  
      // --- Send Success Response ---
      console.log(`Password reset process completed for: ${user.email}. Sending success response.`);
      res.status(200).json({
        status: "success",
        message: "Password has been reset successfully",
      });
  
    } catch (error) { // Main catch block for unexpected errors (500 Internal Server Error)
      console.error("\n!!! Critical Error during Reset Password Process !!!");
      console.error(`Timestamp: ${new Date().toISOString()}`);
      console.error("Error Details:", error); // Log the full error object
  
      // Send a generic 500 error response to the frontend
      res.status(500).json({
        status: "failed",
        // User-friendly generic message for 500 errors
        message: "Unable to reset password at the moment. Please try again later.",
        // Only include detailed technical error in development for security
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
  
  
  

module.exports = {
    create_Customer_OrderSummary,
    create_Product_SalesSummary,
    create_OrderSummary,
    create_Order_DetailsSummary,
    create_Order_Product_DetailSummary,
    create_ShippingSummary,
    create_TaxSummary,
    create_CouponSummary,
    forgotPassword,
    resetPassword,
    validateResetToken,
}