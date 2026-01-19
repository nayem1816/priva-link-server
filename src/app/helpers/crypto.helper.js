const crypto = require("crypto");
const config = require("../config/config");

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES block size is 16 bytes

/**
 * Get or validate the encryption key from environment
 * @returns {Buffer} 32-byte encryption key
 */
const getEncryptionKey = () => {
  const key = config.encryption_key;

  if (!key) {
    throw new Error("ENCRYPTION_KEY is not set in environment variables");
  }

  // If key is provided as hex string (64 chars = 32 bytes)
  if (key.length === 64) {
    return Buffer.from(key, "hex");
  }

  // If key is a regular string, hash it to get 32 bytes
  return crypto.createHash("sha256").update(key).digest();
};

/**
 * Generate a random initialization vector
 * @returns {Buffer} 16-byte random IV
 */
const generateIV = () => {
  return crypto.randomBytes(IV_LENGTH);
};

/**
 * Encrypt plaintext using AES-256-CBC
 * @param {string} plaintext - Text to encrypt
 * @returns {{encryptedContent: string, iv: string}} Hex-encoded encrypted content and IV
 */
const encrypt = (plaintext) => {
  const key = getEncryptionKey();
  const iv = generateIV();

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encryptedContent: encrypted,
    iv: iv.toString("hex"),
  };
};

/**
 * Decrypt content using AES-256-CBC
 * @param {string} encryptedContent - Hex-encoded encrypted content
 * @param {string} ivHex - Hex-encoded initialization vector
 * @returns {string} Decrypted plaintext
 */
const decrypt = (encryptedContent, ivHex) => {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedContent, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

/**
 * Generate a secure random encryption key
 * Use this to generate a key for .env file
 * @returns {string} 64-character hex string (32 bytes)
 */
const generateSecureKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  encrypt,
  decrypt,
  generateIV,
  generateSecureKey,
};
