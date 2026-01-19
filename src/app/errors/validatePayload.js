const { StatusCodes } = require("http-status-codes");
const ApiError = require("./ApiError");

// Validate Payload
const validatePayload = (payload, requiredFields) => {
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Please provide ${field}`);
    }
  }
};

module.exports = validatePayload;
