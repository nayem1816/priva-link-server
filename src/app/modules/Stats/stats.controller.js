const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const StatsService = require("./stats.service");

/**
 * Get application stats
 * GET /api/v1/stats
 */
const getStats = catchAsync(async (req, res) => {
  const stats = await StatsService.getStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Stats retrieved successfully",
    data: stats,
  });
});

module.exports = {
  getStats,
};
