require("dotenv").config();
const axios = require("axios");
const { getFbUser } = require("../services/facebookLeadService");
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
  const saveUser = getFbUser(userAccessToken, userName);
  if (saveUser) {
    return res.status(200).json({
      message: `Welcome, ${userName}`,
    });
  }
};

const loginFailure = function (req, res) {
  res.send("Facebook login failed.");
};

module.exports = {
  metaWebhookHandshake,
  metaWebhookPing,
  loginSuccess,
  loginFailure,
};
