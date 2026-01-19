const mongoose = require("mongoose");
const app = require("./app");
const config = require("./app/config/config");
const { logger, errorLogger } = require("./app/utils/logger");

let server;
const isProduction = config.node_env === "production";

async function startServer() {
  try {
    await mongoose.connect(config.database_url);

    if (isProduction) {
      logger.info("🔒 MongoDB connected successfully for production");
    } else {
      logger.info("🔒 MongoDB connected successfully for development");
    }

    // 🚨 IMPORTANT: Avoid calling this seed function in multiple places.
    // It inserts initial data only if the collection is empty.
    // Coming soon function coming....

    server = app.listen(config.port, () => {
      if (isProduction) {
        logger.info(`🚀 Server is running on production`);
      } else {
        logger.info(`🚀 Server is running on: http://localhost:${config.port}`);
      }
    });
  } catch (error) {
    errorLogger.error("❌ Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

// Graceful shutdown handler
function gracefulShutdown(signal) {
  errorLogger.error(`⚠️ Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(() => {
      logger.info("✅ Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Error handling for unhandled rejections
process.on("unhandledRejection", (error) => {
  errorLogger.error("😈 Unhandled Rejection:", error);
  gracefulShutdown("unhandledRejection");
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
  errorLogger.error("😈 Uncaught Exception:", error);
  process.exit(1);
});

// Signal handlers for graceful shutdown
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Start the application
startServer();
