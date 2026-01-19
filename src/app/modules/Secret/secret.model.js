const mongoose = require("mongoose");
const { Schema } = mongoose;

const SecretSchema = new Schema(
  {
    encryptedContent: {
      type: String,
      required: [true, "Encrypted content is required"],
    },
    iv: {
      type: String,
      required: [true, "Initialization vector is required"],
    },
    passwordHash: {
      type: String,
      default: null,
    },
    // Expiration options in hours
    expirationHours: {
      type: Number,
      enum: [1, 6, 24, 168], // 1h, 6h, 24h, 7 days
      default: 24,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    // View limit options
    viewLimit: {
      type: Number,
      enum: [1, 3, 5, 10], // How many times can be viewed
      default: 1,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// TTL Index: Auto-delete secrets when expiresAt time is reached
// expireAfterSeconds: 0 means delete immediately when expiresAt is passed
SecretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
