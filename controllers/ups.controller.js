const dotenv = require("dotenv");
const settingsModel = require("../models/settings.model");
const { generateTransactionId } = require("../helpers/helper");
const { getFirstSixCharacters } = require("../utils/helpers");
dotenv.config();

const createAuthToken = async (req, res, next) => {
  try {
    const formData = {
      grant_type: "client_credentials",
    };

    const resp = await fetch(`https://wwwcie.ups.com/security/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-merchant-id": "JH2289",
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.USERNAME_UPS}:${process.env.PASSWORD_UPS}`).toString("base64"),
      },
      body: new URLSearchParams(formData).toString(),
    });

    const data = await resp.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const formData = {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    };

    const resp = await fetch(`https://wwwcie.ups.com/security/v1/oauth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.USERNAME_UPS}:${process.env.PASSWORD_UPS}`).toString("base64"),
      },
      body: new URLSearchParams(formData).toString(),
    });

    const data = await resp.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const checkAuthTokenValid = async (req, res, next) => {
  try {
    const { access_token, expires_in, issued_at } = req.body;

    let isTokenExpired = false;
    // Convert expiration time and issued time from milliseconds to seconds
    const expiresInSec = parseInt(expires_in);
    const issuedAtSec = parseInt(issued_at) / 1000;

    // Get current time in seconds
    const currentUnixTime = Math.floor(Date.now() / 1000);

    // Calculate the expiration time in seconds
    const expirationTime = issuedAtSec + expiresInSec;

    // Check if the token is expired
    if (expirationTime < currentUnixTime) {
      isTokenExpired = true;
      // return res.send({
      //   isTokenExpired: true,
      // });
    }

    res.send({
      isTokenExpired,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const verifyAddress = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      regionalrequestindicator: "False",
      maximumcandidatelistsize: 1,
    }).toString();

    const requestoption = 3;
    const version = "v2";
    const resp = await fetch(
      `https://onlinetools.ups.com/api/addressvalidation/${version}/${requestoption}?${query}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.body.access_token}`,
        },
        body: JSON.stringify({
          XAVRequest: {
            Request: {
              RequestOption: "1",
            },
            AddressKeyFormat: req.body.address,
          },
        }),
      }
    );

    const data = await resp.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const getShippingMethods = async (req, res, next) => {
  try {
    const version = "v2409";
    const requestoption = "Shop";

    const settings = await settingsModel.find();

    const shipper = settings[0].shippers[0];
    // console.log("req.body.width", req.body.width);
    const shipFrom = {
      Address: {
        AddressLine: shipper.AddressLine,
        City: shipper.PoliticalDivision2,
        StateProvinceCode: shipper.PoliticalDivision1,
        PostalCode: shipper.PostcodePrimaryLow,
        CountryCode: shipper.CountryCode,
      },
    };
    const shipTo = {
      Address: {
        AddressLine: [req.body.shipTo.streetAddress],
        City: req.body.shipTo.city,
        StateProvinceCode: req.body.shipTo.state,
        PostalCode: req.body.shipTo.zipCode,
        CountryCode: req.body.shipTo.country,
      },
    };
    // console.log("req.body.sets", req.body.sets);
    // console.log("shipTo", shipTo);
    // console.log("shipFrom", shipFrom);

    const packages = Array.from({ length: req.body.sets }).map(() => ({
      PackagingType: {
        Code: "00",
      },
      PackageWeight: {
        UnitOfMeasurement: {
          Code: "LBS",
          Description: "Pounds",
        },
        Weight: getFirstSixCharacters(req.body.weight),
      },
    }));

    const resp = await fetch(`https://onlinetools.ups.com/api/rating/${version}/${requestoption}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        transId: "string",
        transactionSrc: "production",
        Authorization: `Bearer ${req.body.access_token}`,
      },
      body: JSON.stringify({
        RateRequest: {
          // Request: {
          //   RequestOption: "Shop",
          //   TransactionReference: {
          //     CustomerContext: "CustomerContext",
          //   },
          // },
          // PickupType: {
          //   Code: "06",
          // },
          // CustomerClassification: {
          //   Code: "01",
          // },
          Shipment: {
            Shipper: shipFrom,
            ShipTo: shipTo,
            ShipFrom: shipFrom,
            ShipmentRatingOptions: {
              NegotiatedRatesIndicator: "1",
            },
            // ShipmentIndicationType: [
            //   {
            //     Code: "01",
            //   },
            // ],
            // Service: {
            //   Code: "03",
            //   Description: "Ground",
            // },
            // NumOfPieces: "1",
            // NumOfPieces: req.body.sets + "",

            Package: packages,
            // Package: [
            //   {
            //     PackagingType: {
            //       Code: "00",
            //     },
            //     // Dimensions: {
            //     //   UnitOfMeasurement: {
            //     //     Code: "IN",
            //     //     Description: "Inches",
            //     //   },
            //     //   // Length: req.body.height + "",
            //     //   Length: "44.25",
            //     //   // Width: "88.50",
            //     //   Width: req.body.width * 2 + "",
            //     //   Height: req.body.height + "",
            //     //   // Height: "88.50",
            //     // },
            //     PackageWeight: {
            //       UnitOfMeasurement: {
            //         Code: "LBS",
            //         Description: "Pounds",
            //       },
            //       // Weight: "10",
            //       Weight: getFirstSixCharacters(req.body.weight),
            //     },
            //   },
            // ],
          },
        },
      }),
    });

    const data = await resp.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const createShippment = async (req, res, next) => {
  try {
    //getting shipper details from database

    const settings = await settingsModel.find();

    const shipper = settings[0].shippers[0];

    const shipFrom = {
      AddressLine: shipper.AddressLine,
      City: shipper.PoliticalDivision2,
      StateProvinceCode: shipper.PoliticalDivision1,
      PostalCode: shipper.PostcodePrimaryLow,
      CountryCode: shipper.CountryCode,
    };

    console.log("Request: ", req.body);

    // creating token
    const formData = {
      grant_type: "client_credentials",
    };

    const resp = await fetch(`https://wwwcie.ups.com/security/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-merchant-id": "JH2289",
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.USERNAME_UPS}:${process.env.PASSWORD_UPS}`).toString("base64"),
      },
      body: new URLSearchParams(formData).toString(),
    });

    const genratedToken = await resp.json();

    // console.log("Token: ",genratedToken.access_token)

    // creating shippment

    const genrateTransactionId = generateTransactionId();

    const transactionSrcForCreateShippment = "testing";

    const query = new URLSearchParams({
      additionaladdressvalidation: "string",
    }).toString();

    const version = "v2403";
    const resp2 = await fetch(`https://wwwcie.ups.com/api/shipments/${version}/ship?${query}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        transId: genrateTransactionId,
        transactionSrc: transactionSrcForCreateShippment,
        Authorization: `Bearer ${genratedToken.access_token}`,
      },
      body: JSON.stringify({
        ShipmentRequest: {
          Request: {
            RequestOption: "validate ",
            TransactionReference: { CustomerContext: "creatingShippmentTransaction" },
          },
          Shipment: {
            Description: req.body.productName,
            Shipper: {
              Name: "Design Print NYC",
              AttentionName: "Design Print NYC",
              Phone: {
                Number: "16315725131",
              },
              ShipperNumber: "JH2289",
              Address: shipFrom,
            },
            ShipTo: req.body.ShipTo,
            ShipFrom: {
              Name: "Design Print NYC",
              AttentionName: "Design Print NYC",
              AttentionName: "Design Print NYC",
              Phone: {
                Number: "16315725131",
              },
              Address: shipFrom,
            },
            Service: req.body.Service,
            Package: req.body.Package,
            PaymentInformation: {
              ShipmentCharge: {
                Type: "01",
                BillShipper: { AccountNumber: "JH2289" },
              },
            },
          },
        },
      }),
    });

    const data = await resp2.json();

    console.log("Response: ", data);

    console.log("Data: ", data.ShipmentResponse);

    res.send(data);
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  createAuthToken,
  verifyAddress,
  refreshToken,
  checkAuthTokenValid,
  getShippingMethods,
  createShippment,
};
