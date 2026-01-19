const { StatusCodes } = require("http-status-codes");

// Duplicate errors
const handleDuplicateError = (err) => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorMessages = [
    {
      path: "",
      message: `"${extractedMessage}" already exists`,
    },
  ];

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Duplicate field value entered.",
    errorMessages,
  };
};

module.exports = handleDuplicateError;
