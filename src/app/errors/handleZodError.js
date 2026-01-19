const { StatusCodes } = require("http-status-codes");

// zod errors
const handleZodError = (err) => {
  const errorMessages = err.issues.flatMap((issue) => {
    const path = issue.path[issue.path.length - 1];

    switch (issue.code) {
      case "invalid_type":
        return [
          {
            path,
            message: `The field '${path}' is required.`,
          },
        ];

      case "unrecognized_keys":
        return issue.keys.map((key) => ({
          path: key,
          message: `The field '${key}' is invalid.`,
        }));

      default:
        return [
          {
            path,
            message: issue.message,
          },
        ];
    }
  });

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Validation Error",
    errorMessages,
  };
};

module.exports = handleZodError;
