const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Stats schema to track application metrics
 * Uses a single document approach for simplicity
 */
const StatsSchema = new Schema(
  {
    // Total counts
    totalSecretsCreated: {
      type: Number,
      default: 0,
    },
    totalSecretsViewed: {
      type: Number,
      default: 0,
    },
    totalSecretsExpired: {
      type: Number,
      default: 0,
    },
    // Password protected secrets
    passwordProtectedSecrets: {
      type: Number,
      default: 0,
    },
    // View limit breakdown
    viewLimitBreakdown: {
      oneView: { type: Number, default: 0 },
      threeViews: { type: Number, default: 0 },
      fiveViews: { type: Number, default: 0 },
      tenViews: { type: Number, default: 0 },
    },
    // Expiration breakdown
    expirationBreakdown: {
      oneHour: { type: Number, default: 0 },
      sixHours: { type: Number, default: 0 },
      twentyFourHours: { type: Number, default: 0 },
      sevenDays: { type: Number, default: 0 },
    },
    // Daily stats (last 7 days)
    dailyStats: [
      {
        date: { type: Date },
        created: { type: Number, default: 0 },
        viewed: { type: Number, default: 0 },
      },
    ],
    // Last updated
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Stats = mongoose.model("Stats", StatsSchema);

module.exports = Stats;
