const saveUser = require("../model/fbModel");
async function getFbUser(userAccessToken, userName) {
  const saveUsers = saveUser(userAccessToken, userName);
  return saveUsers;
}
module.exports = { getFbUser };
