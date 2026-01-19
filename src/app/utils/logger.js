const path = require("path");
const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("../config/config");
const { combine, timestamp, label, printf } = format;

// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});

// Check environment
const isProduction = config.node_env === "production";

const logger = createLogger({
  level: "info",
  format: combine(label({ label: "SR" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    ...(isProduction
      ? [
          new DailyRotateFile({
            filename: path.join(
              process.cwd(),
              "logs",
              "winston",
              "successes",
              "nym-%DATE%-success.log"
            ),
            datePattern: "YYYY-DD-MM-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
          }),
        ]
      : []),
  ],
});

const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "SR" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    ...(isProduction
      ? [
          new DailyRotateFile({
            filename: path.join(
              process.cwd(),
              "logs",
              "winston",
              "errors",
              "nym-%DATE%-error.log"
            ),
            datePattern: "YYYY-DD-MM-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
          }),
        ]
      : []),
  ],
});

module.exports = { logger, errorLogger };
