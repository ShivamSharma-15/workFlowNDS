const pool = require("../config/db");

async function saveUser(userAccessToken, userName) {
  try {
    const [rows] = await pool.query(
      "INSERT INTO facebook_users (display_name, access_token) VALUES (?,?)",
      [userName, userAccessToken]
    );
    if (rows.affectedRows !== 1) return null;
    else return true;
  } catch (err) {
    console.log("Could not add");
  }
}
module.exports = { saveUser };
