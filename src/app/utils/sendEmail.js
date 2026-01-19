/* eslint-disable no-console */
const nodemailer = require("nodemailer");
const getTransporterOptions = require("./getTransporterOptions");

const sendEmail = async ({ network, to, subject, html }) => {
  try {
    const { smtpConfig, from } = await getTransporterOptions(network);

    const transporter = nodemailer.createTransport({
      service: smtpConfig.service,
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    if (result.accepted.length > 0) {
      console.log("Email sent successfully");
      return { success: true };
    } else {
      return { success: false, reason: "No recipients accepted" };
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = { sendEmail };
