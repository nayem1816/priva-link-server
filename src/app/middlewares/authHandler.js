const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const config = require("../config/config");
const ApiError = require("../errors/ApiError");
const { User } = require("../modules/User/user.model");

/**
 * Middleware to authenticate and authorize the user based on roles.
 * @param {...string} requiredRoles - List of roles required for accessing the route.
 * @returns {function} - Express middleware to authenticate and authorize the user.
 */

const auth =
  (...requiredRoles) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      // Verify token
      let verifiedUser = null;
      verifiedUser = jwt.verify(token, config.jwt.secret);

      const user = await User.findById(verifiedUser._id);
      if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
      }

      req.user = user;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = auth;
