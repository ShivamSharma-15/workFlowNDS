const { saveUser, savePage, subscribe } = require("../model/fbModel");
const axios = require("axios");
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
async function getAllFbPages(userAccessToken) {
  const pagesResponse = await axios.get(
    "https://graph.facebook.com/v22.0/me/accounts",
    {
      params: {
        access_token: userAccessToken,
      },
    }
  );
  const pages = pagesResponse.data.data;
  if (pages) {
    return pages;
  } else return null;
}
async function subscribeToAllPages(pages) {
  const subscriptionResults = await Promise.all(
    pages.map(async (page) => {
      try {
        await axios.post(
          `https://graph.facebook.com/v22.0/${page.id}/subscribed_apps`,
          null,
          {
            params: {
              access_token: page.access_token,
              subscribed_fields: "leadgen",
            },
          }
        );
        return { page: page.name, pageId: page.id, success: true };
      } catch (err) {
        return {
          page: page.name,
          pageId: page.id,
          success: false,
          error: err.response?.data || err.message,
        };
      }
    })
  );
  const successfulSubs = subscriptionResults.filter((r) => r.success);
  if (successfulSubs) {
    return successfulSubs;
  } else {
    return null;
  }
}
module.exports = {
  getFbUser,
  getFbPages,
  isSubbed,
  getAllFbPages,
  subscribeToAllPages,
};
