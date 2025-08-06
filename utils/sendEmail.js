const nodemailer = require("nodemailer");

const config = require("config");

module.exports = async (email, subject, text, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.get("v1.EMAIL_HOST_SERVER"),
      secure: true,
      port: config.get("v1.EMAIL_PORT"),
      logger: false,
      debug: true,
      // service: process.env.SERVICE,
      auth: {
        user: config.get("v1.EMAIL_USERNAME"),
        pass: config.get("v1.EMAIL_PASSWORD"),
      },
      tls: {
        rejectUnauthorized: false,
      },
      dkim: {
        domainName: "web2printsolution.com", // Your domain
        keySelector: "mail", // Your DKIM selector
        privateKey: require("fs").readFileSync("./private.key", {
          encoding: "utf8",
        }), // Your DKIM private key
      },
      logger: true,
    });

    await transporter.sendMail({
      from: config.get("v1.EMAIL_USERNAME"),
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
        <html lang="en">
        <body>${text}</body>
        </html>
        `,
      attachments: attachments,
    });
    console.log("Email sent successfully");

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error };
  }
};
