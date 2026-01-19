const express = require("express");

const skipBodyParsingRoutes = [];

// Middleware to handle body parsing
const customBodyParser = (req, res, next) => {
  if (
    skipBodyParsingRoutes.some((route) => req.originalUrl.startsWith(route))
  ) {
    return next();
  }

  // Dynamically apply the appropriate parser based on Content-Type
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    return express.json()(req, res, next);
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    return express.urlencoded({ extended: true })(req, res, next);
  }

  next();
};

module.exports = customBodyParser;
