const crypto = require("crypto");
require("dotenv").config();

const APP_SECRET = process.env.META_APP_SECRET; // Make sure this is set in .env!

const verifyMetaSignature = (req, res, next) => {
  const signature = req.headers["x-hub-signature"];

  if (!signature) {
    console.warn("Missing X-Hub-Signature");
    return res.sendStatus(403);
  }

  if (!req.rawBody) {
    console.warn("Missing rawBody on request");
    return res.sendStatus(400);
  }

  const [method, hash] = signature.split("=");

  const expectedHash = crypto
    .createHmac("sha1", APP_SECRET)
    .update(req.rawBody)
    .digest("hex");

  if (hash !== expectedHash) {
    console.warn("Invalid X-Hub-Signature");
    return res.sendStatus(403);
  }

  next();
};

module.exports = {
  verifyMetaSignature,
};
