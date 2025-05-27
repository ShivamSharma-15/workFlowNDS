const pool = require("../config/db");

async function saveUser(userAccessToken, userName) {
  try {
    const [rows] = await pool.query(
      "INSERT INTO facebook_users (display_name, access_token) VALUES (?,?)",
      [userName, userAccessToken]
    );
    if (rows.affectedRows !== 1) return null;
    else return rows.insertId;
  } catch (err) {
    console.log("Could not add");
  }
}
async function savePage(pages, userId) {
  const insertQuery = `
    INSERT INTO facebook_pages (user_id, page_id, page_name, page_access_token)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      page_name = VALUES(page_name),
      page_access_token = VALUES(page_access_token)
  `;

  const promises = pages.map((page) =>
    pool.query(insertQuery, [
      userId,
      page.id,
      page.name || null,
      page.access_token,
    ])
  );

  await Promise.all(promises);
}
async function subscribe(successfulSubs) {
  if (!successfulSubs || successfulSubs.length === 0) return;

  const updateQuery = `
    UPDATE facebook_pages
    SET subscribed = 1
    WHERE page_id = ?
  `;

  const promises = successfulSubs.map((entry) => {
    const pageId = entry.pageId || entry.id;
    if (!pageId) return null;
    return pool.query(updateQuery, [pageId]);
  });

  await Promise.all(promises);
}
async function getPageAccessToken(page_id) {
  const page_id_str = String(page_id).trim();
  try {
    const [rows] = await pool.query(
      "SELECT id, page_access_token FROM facebook_pages WHERE page_id = ?",
      [page_id_str]
    );
    if (rows.length !== 1) return null;
    else return rows[0];
  } catch (err) {
    console.log("Could not find", err);
  }
}
async function leadAddDb(leadData, lead, idPage) {
  try {
    const [rows] = await pool.query(
      "INSERT INTO fb_leads (lead_id, lead_data, page_id, form_id, created_at) VALUES (?,?,?,?,?)",
      [lead?.leadgen_id, leadData, idPage, lead?.form_id, lead?.created_time]
    );
    if (rows.affectedRows !== 1) return null;
    else return true;
  } catch (err) {
    console.log("cannot insert the lead");
  }
}
module.exports = {
  saveUser,
  savePage,
  subscribe,
  getPageAccessToken,
  leadAddDb,
};
