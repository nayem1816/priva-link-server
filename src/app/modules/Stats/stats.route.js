const express = require("express");
const StatsController = require("./stats.controller");

const router = express.Router();

// GET /api/v1/stats - Get application stats
router.get("/", StatsController.getStats);

module.exports = router;
