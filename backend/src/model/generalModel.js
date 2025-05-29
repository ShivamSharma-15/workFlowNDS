const pool = require("../config/db");
async function allowedRoutesModel() {
  try {
    const [rows] = await pool.query(
      "SELECT website_url FROM client_onboarding"
    );
    return rows.length > 0 ? rows : null;
  } catch (err) {
    console.log("cannot do this right now", err);
    return null;
  }
}
module.exports = { allowedRoutesModel };
