const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Secret = require("./secret.model");
const { encrypt, decrypt } = require("../../helpers/crypto.helper");
const config = require("../../config/config");
const AppError = require("../../errors/AppError");
const { StatusCodes } = require("http-status-codes");

/**
 * Create a new encrypted secret
 * @param {string} content - Plain text content to encrypt
 * @param {string|undefined} password - Optional password for additional security
 * @param {number} expirationHours - Hours until expiration (1, 6, 24, or 168)
 * @returns {Promise<{id: string, url: string, expiresAt: Date}>}
 */
const createSecret = async (content, password, expirationHours = 24) => {
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
  });

  // Generate the URL
  const frontendUrl = config.frontend_link || "http://localhost:3000";
  const url = `${frontendUrl}/secret/${secret._id}`;

  return {
    id: secret._id.toString(),
    url,
    expiresAt,
  };
};

/**
 * Check if a secret exists (without fetching content)
 * @param {string} id - Secret ID
 * @returns {Promise<{exists: boolean, hasPassword: boolean, expiresAt: Date|null}>}
 */
const checkSecretExists = async (id) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { exists: false, hasPassword: false, expiresAt: null };
  }

  // Find secret, only select passwordHash and expiresAt fields
  const secret = await Secret.findById(id)
    .select("passwordHash expiresAt")
    .lean();

  if (!secret) {
    return { exists: false, hasPassword: false, expiresAt: null };
  }

  return {
    exists: true,
    hasPassword: !!secret.passwordHash,
    expiresAt: secret.expiresAt,
  };
};

/**
 * Reveal and permanently delete a secret
 * @param {string} id - Secret ID
 * @param {string|undefined} password - Password if secret is protected
 * @returns {Promise<{content: string}>}
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

  // IMMEDIATELY delete the secret from database
  await Secret.findByIdAndDelete(id);

  return { content };
};

module.exports = {
  createSecret,
  checkSecretExists,
  revealSecret,
};
