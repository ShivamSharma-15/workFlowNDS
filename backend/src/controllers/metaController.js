require("dotenv").config();
const axios = require("axios");
const {
  getFbUser,
  getFbPages,
  isSubbed,
  getAllFbPages,
  subscribeToAllPages,
  leadAdded,
  sendWhatsappUpdate,
} = require("../services/facebookLeadService");
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

      try {
        const leadAdd = await leadAdded(lead);
        if (leadAdd) {
          console.log("Lead added successfully");
          const sendWaMessage = await sendWhatsappUpdate(lead, leadAdd);
        }
      } catch (e) {
        console.error("Error processing lead:", e.message);
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
  const userId = req.user.id;
  const saveUser = await getFbUser(userAccessToken, userName, userId);
  const pages = await getAllFbPages(userAccessToken);
  const savePage = await getFbPages(pages, saveUser);
  if (pages && savePage) {
    const successfulSubs = await subscribeToAllPages(pages);
    if (successfulSubs) {
      const saveSubscription = await isSubbed(successfulSubs);
    }
  }
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
