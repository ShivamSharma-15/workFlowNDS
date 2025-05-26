const { saveUser, savePage } = require("../model/fbModel");
async function getFbUser(userAccessToken, userName) {
  const saveUsers = saveUser(userAccessToken, userName);
  return saveUsers;
}
async function getFbPages(pages, savedUser) {
  try {
    await savePage(pages, savedUser);
    console.log("All pages saved successfully.");
  } catch (error) {
    console.error("Error saving pages:", error);
  }
}
module.exports = { getFbUser, getFbPages };
