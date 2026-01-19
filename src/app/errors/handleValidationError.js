const { StatusCodes } = require("http-status-codes");

// Validation error
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((el) => ({
    path: el?.path,
    message: el?.message,
  }));

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: errors[0]?.message || error?.message || "Something went wrong!",
    errorMessages: errors,
  };
};

module.exports = handleValidationError;
