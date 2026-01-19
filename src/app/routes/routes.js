const express = require("express");
const UserRoutes = require("../modules/User/user.route");
const SecretRoutes = require("../modules/Secret/secret.route");

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/secret",
    route: SecretRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
