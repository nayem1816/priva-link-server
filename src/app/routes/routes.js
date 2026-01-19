const express = require("express");
const UserRoutes = require("../modules/User/user.route");
const SecretRoutes = require("../modules/Secret/secret.route");
const StatsRoutes = require("../modules/Stats/stats.route");

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
  {
    path: "/stats",
    route: StatsRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;

