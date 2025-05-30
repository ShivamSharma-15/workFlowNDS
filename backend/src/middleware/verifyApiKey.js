const poolWeb = require("../config/db");

async function verifyApiKey(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    const keyExists = await poolWeb.query(
      "SELECT * FROM api_keys WHERE key_value = ?",
      [apiKey]
    );
    if (!keyExists.length) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    req.apiKey = apiKey;

    next();
  } catch (err) {
    console.error("API key verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = { verifyApiKey };
