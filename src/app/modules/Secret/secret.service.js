const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Secret = require("./secret.model");
const { encrypt, decrypt } = require("../../helpers/crypto.helper");
const config = require("../../config/config");
const AppError = require("../../errors/AppError");
const { StatusCodes } = require("http-status-codes");
const { sendSecretViewedEmail } = require("../../helpers/secretNotification.helper");

/**
 * Create a new encrypted secret
 * @param {string} content - Plain text content to encrypt
 * @param {string|undefined} password - Optional password for additional security
 * @param {number} expirationHours - Hours until expiration (1, 6, 24, or 168)
 * @param {number} viewLimit - Number of times secret can be viewed (1, 3, 5, or 10)
 * @param {string|undefined} notifyEmail - Optional email for view notifications
 * @returns {Promise<{id: string, url: string, expiresAt: Date, viewLimit: number}>}
 */
const createSecret = async (content, password, expirationHours = 24, viewLimit = 1, notifyEmail = null) => {
  // Encrypt the content
  const { encryptedContent, iv } = encrypt(content);

  // Hash password if provided
  let passwordHash = null;
  if (password) {
    const saltRounds = parseInt(config.bcrypt_salt_rounds) || 10;
    passwordHash = await bcrypt.hash(password, saltRounds);
  }

  // Calculate expiration time
  const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

  // Create the secret document
  const secret = await Secret.create({
    encryptedContent,
    iv,
    passwordHash,
    expirationHours,
    expiresAt,
    viewLimit,
    viewCount: 0,
    notifyEmail: notifyEmail || null,
  });

  // Generate the URL
  const frontendUrl = config.frontend_link || "http://localhost:3000";
  const url = `${frontendUrl}/secret/${secret._id}`;

  return {
    id: secret._id.toString(),
    url,
    expiresAt,
    viewLimit,
  };
};

/**
 * Check if a secret exists (without fetching content)
 * @param {string} id - Secret ID
 * @returns {Promise<{exists: boolean, hasPassword: boolean, expiresAt: Date|null, viewLimit: number, viewCount: number, remainingViews: number}>}
 */
const checkSecretExists = async (id) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { exists: false, hasPassword: false, expiresAt: null, viewLimit: 0, viewCount: 0, remainingViews: 0 };
  }

  // Find secret, select needed fields
  const secret = await Secret.findById(id)
    .select("passwordHash expiresAt viewLimit viewCount")
    .lean();

  if (!secret) {
    return { exists: false, hasPassword: false, expiresAt: null, viewLimit: 0, viewCount: 0, remainingViews: 0 };
  }

  const remainingViews = secret.viewLimit - secret.viewCount;

  return {
    exists: true,
    hasPassword: !!secret.passwordHash,
    expiresAt: secret.expiresAt,
    viewLimit: secret.viewLimit,
    viewCount: secret.viewCount,
    remainingViews,
  };
};

/**
 * Reveal a secret. Increments view count and deletes when limit reached.
 * @param {string} id - Secret ID
 * @param {string|undefined} password - Password if secret is protected
 * @returns {Promise<{content: string, remainingViews: number, isLastView: boolean}>}
 */
const revealSecret = async (id, password) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Secret not found or has expired"
    );
  }

  // Find the secret
  const secret = await Secret.findById(id);

  if (!secret) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Secret not found or has expired"
    );
  }

  // Verify password if required
  if (secret.passwordHash) {
    if (!password) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Password is required");
    }

    const isPasswordValid = await bcrypt.compare(password, secret.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid password");
    }
  }

  // Decrypt the content
  const content = decrypt(secret.encryptedContent, secret.iv);

  // Increment view count
  const newViewCount = secret.viewCount + 1;
  const remainingViews = secret.viewLimit - newViewCount;
  const isLastView = remainingViews <= 0;

  if (isLastView) {
    // This is the last view - delete the secret
    await Secret.findByIdAndDelete(id);
  } else {
    // Update view count
    await Secret.findByIdAndUpdate(id, { viewCount: newViewCount });
  }

  // Send email notification if configured (don't await to not block response)
  if (secret.notifyEmail) {
    sendSecretViewedEmail(secret.notifyEmail, id, {
      remainingViews: Math.max(0, remainingViews),
      isLastView,
      viewedAt: new Date(),
    }).catch(err => console.error("[Email] Error:", err.message));
  }

  return {
    content,
    remainingViews: Math.max(0, remainingViews),
    isLastView,
  };
};

module.exports = {
  createSecret,
  checkSecretExists,
  revealSecret,
};

