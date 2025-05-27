const {
  saveUser,
  savePage,
  subscribe,
  leadAddDb,
  getPageAccessToken,
} = require("../model/fbModel");
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
async function leadAdded(lead) {
  try {
    const leadgen_id = lead?.leadgen_id;
    const page_id = lead?.page_id;
    if (!leadgen_id || !page_id) {
      console.warn("Missing leadgen_id or page_id");
      return null;
    }

    const pageAccessTokenRow = await getPageAccessToken(page_id);
    const pageAccessToken = pageAccessTokenRow.page_access_token;
    const idPage = pageAccessTokenRow.id;

    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${leadgen_id}`,
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );

    const leadData = response.data;

    if (!leadData || !leadData.id) {
      console.warn("Lead data from Graph API is missing expected fields");
      return null;
    }
    const createdAt = formatToMySQLDateTime(lead?.created_time);

    const leadDataToDB = await leadAddDb(leadData, lead, idPage, createdAt);
    return leadDataToDB ? true : null;
  } catch (error) {
    console.error(
      "leadAdded error:",
      error.response?.data || error.message || error
    );
    return null;
  }
}
export async function sendWhatsappUpdate(lead) {
  const pageAccessTokenRow = await getPageAccessToken(page_id);
  const pageAccessToken = pageAccessTokenRow.page_access_token;
  const form_id = lead?.form_id;
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${form_id}`,
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );
    const formName = response.name;
    console.log(formName);
  } catch (error) {
    console.error(
      "Error Sending message",
      error.response?.data || error.message || error
    );
    return null;
  }
}
function formatToMySQLDateTime(input) {
  const date = new Date(typeof input === "number" ? input * 1000 : input);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

module.exports = {
  getFbUser,
  getFbPages,
  isSubbed,
  getAllFbPages,
  subscribeToAllPages,
  leadAdded,
  sendWhatsappUpdate,
};
