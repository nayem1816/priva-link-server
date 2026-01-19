const Stats = require("./stats.model");

/**
 * Get or create stats document
 * Uses upsert to ensure a single stats document exists
 */
const getOrCreateStats = async () => {
  let stats = await Stats.findOne({});
  if (!stats) {
    stats = await Stats.create({});
  }
  return stats;
};

/**
 * Get today's date at midnight for daily stats tracking
 */
const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Increment stats when a secret is created
 * @param {number} viewLimit - View limit of the secret
 * @param {number} expirationHours - Expiration hours
 * @param {boolean} hasPassword - Whether secret has password
 */
const incrementCreated = async (viewLimit, expirationHours, hasPassword) => {
  const today = getTodayDate();

  // Build update object
  const update = {
    $inc: {
      totalSecretsCreated: 1,
    },
    $set: {
      lastUpdated: new Date(),
    },
  };

  // Increment password protected secrets
  if (hasPassword) {
    update.$inc.passwordProtectedSecrets = 1;
  }

  // Increment view limit breakdown
  switch (viewLimit) {
    case 1:
      update.$inc["viewLimitBreakdown.oneView"] = 1;
      break;
    case 3:
      update.$inc["viewLimitBreakdown.threeViews"] = 1;
      break;
    case 5:
      update.$inc["viewLimitBreakdown.fiveViews"] = 1;
      break;
    case 10:
      update.$inc["viewLimitBreakdown.tenViews"] = 1;
      break;
  }

  // Increment expiration breakdown
  switch (expirationHours) {
    case 1:
      update.$inc["expirationBreakdown.oneHour"] = 1;
      break;
    case 6:
      update.$inc["expirationBreakdown.sixHours"] = 1;
      break;
    case 24:
      update.$inc["expirationBreakdown.twentyFourHours"] = 1;
      break;
    case 168:
      update.$inc["expirationBreakdown.sevenDays"] = 1;
      break;
  }

  // Update or create stats document
  await Stats.findOneAndUpdate({}, update, { upsert: true });

  // Update daily stats
  await Stats.findOneAndUpdate(
    { "dailyStats.date": today },
    { $inc: { "dailyStats.$.created": 1 } }
  );

  // If today's entry doesn't exist, add it
  const result = await Stats.findOne({ "dailyStats.date": today });
  if (!result) {
    await Stats.findOneAndUpdate(
      {},
      {
        $push: {
          dailyStats: {
            $each: [{ date: today, created: 1, viewed: 0 }],
            $slice: -7, // Keep only last 7 days
          },
        },
      },
      { upsert: true }
    );
  }
};

/**
 * Increment stats when a secret is viewed
 */
const incrementViewed = async () => {
  const today = getTodayDate();

  await Stats.findOneAndUpdate(
    {},
    {
      $inc: { totalSecretsViewed: 1 },
      $set: { lastUpdated: new Date() },
    },
    { upsert: true }
  );

  // Update daily stats
  await Stats.findOneAndUpdate(
    { "dailyStats.date": today },
    { $inc: { "dailyStats.$.viewed": 1 } }
  );

  // If today's entry doesn't exist, add it
  const result = await Stats.findOne({ "dailyStats.date": today });
  if (!result) {
    await Stats.findOneAndUpdate(
      {},
      {
        $push: {
          dailyStats: {
            $each: [{ date: today, created: 0, viewed: 1 }],
            $slice: -7,
          },
        },
      },
      { upsert: true }
    );
  }
};

/**
 * Increment stats when a secret expires
 */
const incrementExpired = async () => {
  await Stats.findOneAndUpdate(
    {},
    {
      $inc: { totalSecretsExpired: 1 },
      $set: { lastUpdated: new Date() },
    },
    { upsert: true }
  );
};

/**
 * Get all stats
 */
const getStats = async () => {
  const stats = await getOrCreateStats();
  return stats;
};

module.exports = {
  getOrCreateStats,
  incrementCreated,
  incrementViewed,
  incrementExpired,
  getStats,
};
