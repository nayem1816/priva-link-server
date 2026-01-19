const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const SecretService = require("./secret.service");

/**
 * Create a new secret
 * POST /api/v1/secret
 */
const createSecret = catchAsync(async (req, res) => {
  const { content, password, expirationHours } = req.body;

  const result = await SecretService.createSecret(
    content,
    password,
    expirationHours
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Secret created successfully",
    data: result,
  });
});

/**
 * Check if a secret exists (metadata only)
 * GET /api/v1/secret/:id
 */
const checkSecret = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SecretService.checkSecretExists(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.exists ? "Secret found" : "Secret not found",
    data: result,
  });
});

/**
 * Reveal and delete a secret
 * POST /api/v1/secret/:id/reveal
 */
const revealSecret = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const result = await SecretService.revealSecret(id, password);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Secret revealed and destroyed",
    data: result,
  });
});

module.exports = {
  createSecret,
  checkSecret,
  revealSecret,
};
