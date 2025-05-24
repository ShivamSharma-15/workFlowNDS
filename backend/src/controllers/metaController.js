require("dotenv").config();
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
  console.log(body);

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
const loginSuccess = function (req, res) {
  res.send(`Welcome, ${req.user.displayName}`);
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
