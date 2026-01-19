const { StatusCodes } = require("http-status-codes");

// Application Error class
class AppError extends Error {
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Set the stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Factory methods for common errors
  static badRequest(message = "Bad Request") {
    return new AppError(StatusCodes.BAD_REQUEST, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(StatusCodes.UNAUTHORIZED, message);
  }

  static notFound(message = "Not Found") {
    return new AppError(StatusCodes.NOT_FOUND, message);
  }

  static internal(message = "Internal Server Error") {
    return new AppError(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

module.exports = AppError;
