/* eslint-disable no-unused-vars */
const parseRequestData = (req, res, next) => {
  try {
    if (typeof req.body.data === "string") {
      req.body = JSON.parse(req.body.data);
    }
    next();
  } catch (error) {
    throw new Error(
      "Please ensure that 'req.body.data' contains JSON-stringified content."
    );
  }
};

module.exports = parseRequestData;
