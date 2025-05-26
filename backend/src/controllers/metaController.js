require("dotenv").config();
const axios = require("axios");
const {
  getFbUser,
  getFbPages,
  isSubbed,
} = require("../services/facebookLeadService");
const { user } = require("../config/dbConfig");
const metaWebhookHandshake = async (req, res) => {
  const key = process.env.META_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === key) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};
const metaWebhookPing = async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const lead = entry.changes?.[0]?.value;
      console.log(lead);
      const leadgen_id = lead?.leadgen_id;

      if (leadgen_id) {
        console.log("New Lead ID:", leadgen_id);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
const loginSuccess = async function (req, res) {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).send("User is not authenticated.");
  }
  const userAccessToken = req.user.accessToken;
  const userName = req.user.displayName;
  const saveUser = await getFbUser(userAccessToken, userName);
  const pagesResponse = await axios.get(
    "https://graph.facebook.com/v22.0/me/accounts",
    {
      params: {
        access_token: userAccessToken,
      },
    }
  );
  const pages = pagesResponse.data.data;
  const savePage = await getFbPages(pages, saveUser);
  let subscriptionResults;
  if (pages && savePage) {
    subscriptionResults = await Promise.all(
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
  }
  const successfulSubs = subscriptionResults.filter((r) => r.success);
  const saveSubscription = await isSubbed(successfulSubs);
  if (!pages || pages.length === 0) {
    return res
      .status(200)
      .send("Login successful, but no pages were found for this user.");
  }
  if (saveUser) {
    return res.status(200).json({
      message: `Welcome, ${userName}`,
    });
  }
};
const refreshPageList = async function (req, res) {
  const getUser = await getUserAccessToken();
  const pagesResponse = await axios.get(
    "https://graph.facebook.com/v22.0/me/accounts",
    {
      params: {
        access_token: getUser,
      },
    }
  );
  const pages = pagesResponse.data.data;
  const savePage = getFbPages(pages, saveUser);
};
const loginFailure = function (req, res) {
  res.send("Facebook login failed.");
};

module.exports = {
  metaWebhookHandshake,
  metaWebhookPing,
  loginSuccess,
  loginFailure,
  refreshPageList,
};
