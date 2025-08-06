const generateAccessTokenSandbox = async () => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID_SANDBOX || !process.env.PAYPAL_CLIENT_SECRET_SANDBOX) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID_SANDBOX + ":" + process.env.PAYPAL_CLIENT_SECRET_SANDBOX
    ).toString("base64");
    const response = await fetch(`${process.env.PAYPAL_SANDBOX_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const generateAccessTokenRoot = async () => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${process.env.PAYPAL_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart, isSandbox, amount_total, merchant_email) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log("shopping cart information passed from the frontend createOrder() callback:", cart);
  const accessToken = isSandbox
    ? await generateAccessTokenSandbox()
    : await generateAccessTokenRoot();

  const url = isSandbox
    ? `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders`
    : `${process.env.PAYPAL_URL}/v2/checkout/orders`;

  const purchase_units_data = isSandbox
    ? {
        amount: {
          currency_code: "EUR",
          value: amount_total,
        },
      }
    : {
        amount: {
          currency_code: "EUR",
          value: amount_total,
        },
        payee: {
          email_address: merchant_email,
        },
      };
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      purchase_units_data,
      //   {
      //     amount: {
      //       currency_code: "EUR",
      //       value: amount_total,
      //     },
      //     payee: {
      //       email_address: "Capripizza786@web.de",
      //     },
      //   },
    ],
  };
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID, isSandbox) => {
  const accessToken = isSandbox
    ? await generateAccessTokenSandbox()
    : await generateAccessTokenRoot();
  const url = isSandbox
    ? `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders/${orderID}/capture`
    : `${process.env.PAYPAL_URL}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });
  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

module.exports = { captureOrder, createOrder, handleResponse };
