const { saveUser, savePage, subscribe } = require("../model/fbModel");
async function getFbUser(userAccessToken, userName) {
  const saveUsers = saveUser(userAccessToken, userName);
  return saveUsers;
}
async function getFbPages(pages, savedUser) {
  try {
    await savePage(pages, savedUser);
    console.log("All pages saved successfully.");
    return true;
  } catch (error) {
    console.error("Error saving pages:", error);
    return false;
  }
}
async function isSubbed(successfulSubs) {
  try {
    await subscribe(successfulSubs);
    console.log("All pages subbed successfully.");
    return true;
  } catch (error) {
    console.error("Error subbing pages:", error);
    return false;
  }
}
module.exports = { getFbUser, getFbPages, isSubbed };
