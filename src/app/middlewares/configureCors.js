const cors = require("cors");
const config = require("../config/config");

const configureCors = () => {
  // Allowed origins list (exact match)
  const allowedOrigins = config.frontend_link.split(",");

  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // Check exact match
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
};

module.exports = configureCors;
