const crypto = require("crypto");
require("dotenv").config();
const APP_SECRET = process.env.META_VERIFY_TOKEN;

const verifyMetaSignature = (req, res, next) => {
  const signature = req.headers["x-hub-signature"];

  if (!signature) {
    console.warn("Missing X-Hub-Signature");
    return res.sendStatus(403);
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
