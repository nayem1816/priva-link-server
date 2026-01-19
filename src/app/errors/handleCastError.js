const { StatusCodes } = require("http-status-codes");

// Cast Errors
const handleCastError = (error) => {
  const errors = [
    {
      path: error.path,
      message: "Invalid Id",
    },
  ];

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Cast Error",
    errorMessages: errors,
  };
};

module.exports = handleCastError;
