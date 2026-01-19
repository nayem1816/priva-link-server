const catchAsync = require("../utils/catchAsync");

const validateRequest = (schema) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      cookies: req.cookies,
    });

    next();
  });
};

module.exports = validateRequest;
