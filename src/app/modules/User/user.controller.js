const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/sendResponse");
const UserService = require("./user.service");

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserFromDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User successfully created",
    data: result,
  });
});

module.exports = {
  createUser,
};
