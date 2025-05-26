const saveUser = require("../model/fbModel");
async function getFbUser(userAccessToken, userName) {
  const saveUser = saveUser(userAccessToken, userName);
  return saveUser;
}
module.exports = { getFbUser };
