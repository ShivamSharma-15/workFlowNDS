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

module.exports = { metaWebhookHandshake };
