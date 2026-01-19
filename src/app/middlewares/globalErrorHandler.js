/* eslint-disable no-unused-vars */
const { StatusCodes } = require("http-status-codes");
const handleValidationError = require("../errors/handleValidationError");
const handleCastError = require("../errors/handleCastError");
const handleDuplicateError = require("../errors/handleDuplicateError");
const ApiError = require("../errors/ApiError");
const config = require("../config/config");
const { ZodError } = require("zod");
const handleZodError = require("../errors/handleZodError");
const { errorLogger } = require("../utils/logger");

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorMessages = [];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [{ path: "", message: error?.message }]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [{ path: "", message: error?.message }]
      : [];
  }

  if (config.node_env === "development") {
    console.error("Global Error Handler:", error);
  }

  if (config.node_env === "production") {
    errorLogger.error("❌ Global Error Handler:", error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env === "development" ? error.stack : null,
  });
};

module.exports = globalErrorHandler;
