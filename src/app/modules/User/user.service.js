const { User } = require("./user.model");

const createUserFromDB = async (payload) => {
  const result = await User.create(payload);
  return result;
};

module.exports = {
  createUserFromDB,
};
