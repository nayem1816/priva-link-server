const express = require("express");
const UserController = require("./user.controller");
const auth = require("../../middlewares/authHandler");

const router = express.Router();

//** User routes **//

router.post("/", auth(), UserController.createUser);

module.exports = router;
