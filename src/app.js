const express = require("express");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./app/middlewares/globalErrorHandler");
const router = require("./app/routes/routes");
const notFound = require("./app/middlewares/notFound");
const customBodyParser = require("./app/middlewares/customBodyParser");
const configureCors = require("./app/middlewares/configureCors");

const app = express();

// Middleware
app.use(cookieParser());

app.use(configureCors());

app.use(customBodyParser);

app.use(express.static("uploads"));

// Home Route
app.get("/", async (req, res) => {
  res.send("<h3>Mock Server Running ✅</h3>");
});

// Application Routes
app.use("/api/v1", router);

//global error handler
app.use(globalErrorHandler);

//Not Found Route
app.use(notFound);

module.exports = app;
