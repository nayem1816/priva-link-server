/* eslint-disable no-console */
const nodemailer = require("nodemailer");
const config = require("../config/config");

/**
 * Send email notification when a secret is viewed
 * @param {string} email - Email to notify
 * @param {string} secretId - Secret ID that was viewed
 * @param {Object} viewDetails - Details about the view
 * @param {number} viewDetails.remainingViews - Views remaining
 * @param {boolean} viewDetails.isLastView - Whether this is the last view
 * @param {Date} viewDetails.viewedAt - When it was viewed
 */
const sendSecretViewedEmail = async (email, secretId, viewDetails) => {
  try {
    // Skip if no email config
    if (!config.nodemailer.user || !config.nodemailer.password) {
      console.log("[Email] SMTP not configured, skipping notification");
      return { success: false, reason: "SMTP not configured" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.password,
      },
    });

    const { remainingViews, isLastView, viewedAt } = viewDetails;
    const viewTime = new Date(viewedAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const statusMessage = isLastView
      ? "🔥 Your secret has been destroyed"
      : `👀 ${remainingViews} view(s) remaining`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px 20px; margin: 0; }
          .container { max-width: 500px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 32px; border: 1px solid #2a2a4a; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #50a6ff, #ffffff); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 24px; }
          .title { font-size: 20px; color: #ffffff; margin-bottom: 16px; }
          .status { padding: 16px; background: ${isLastView ? '#7f1d1d' : '#1e3a5f'}; border-radius: 12px; margin-bottom: 24px; text-align: center; }
          .detail { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #2a2a4a; color: #8f8f8f; }
          .detail-label { color: #8f8f8f; }
          .detail-value { color: #ffffff; }
          .footer { margin-top: 24px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🔐 PrivaLink</div>
          <div class="title">Your Secret Was Viewed</div>
          <div class="status">${statusMessage}</div>
          <div class="detail">
            <span class="detail-label">Viewed At</span>
            <span class="detail-value">${viewTime}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Secret ID</span>
            <span class="detail-value">${secretId.substring(0, 8)}...</span>
          </div>
          <div class="detail" style="border-bottom: none;">
            <span class="detail-label">Status</span>
            <span class="detail-value">${isLastView ? 'Destroyed' : 'Active'}</span>
          </div>
          <div class="footer">
            This notification was sent because you enabled view alerts for this secret.
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await transporter.sendMail({
      from: `"PrivaLink" <${config.nodemailer.user}>`,
      to: email,
      subject: `🔐 Your secret was viewed${isLastView ? ' and destroyed' : ''}`,
      html,
    });

    if (result.accepted.length > 0) {
      console.log(`[Email] Notification sent to ${email}`);
      return { success: true };
    } else {
      return { success: false, reason: "No recipients accepted" };
    }
  } catch (error) {
    console.error("[Email] Failed to send notification:", error.message);
    return { success: false, reason: error.message };
  }
};

module.exports = { sendSecretViewedEmail };
