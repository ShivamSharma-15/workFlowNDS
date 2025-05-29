const pool = require("../config/db");

async function saveUser(userAccessToken, userName, userId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [check] = await conn.query(
      "SELECT id FROM facebook_users WHERE user_id = ?",
      [userId]
    );

    if (check.length !== 0) {
      await conn.query(
        "UPDATE facebook_users SET display_name = ?, access_token = ? WHERE user_id = ?",
        [userName, userAccessToken, userId]
      );
      await conn.commit();
      return check[0].id;
    } else {
      const [rows] = await conn.query(
        "INSERT INTO facebook_users (display_name, access_token, user_id) VALUES (?, ?, ?)",
        [userName, userAccessToken, userId]
      );
      await conn.commit();
      return rows.insertId;
    }
  } catch (err) {
    await conn.rollback();
    console.error("Transaction failed:", err);
    return null;
  } finally {
    conn.release();
  }
}

async function savePage(pages, userId) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const page of pages) {
      const [rows] = await conn.query(
        "SELECT user_id FROM facebook_pages WHERE page_id = ?",
        [page.id]
      );

      if (rows.length === 0) {
        // Page doesn't exist → insert it
        await conn.query(
          "INSERT INTO facebook_pages (user_id, page_id, page_name, page_access_token) VALUES (?, ?, ?, ?)",
          [userId, page.id, page.name || null, page.access_token]
        );
      } else if (rows[0].user_id === userId) {
        await conn.query(
          "UPDATE facebook_pages SET page_name = ?, page_access_token = ? WHERE page_id = ? AND user_id = ?",
          [page.name || null, page.access_token, page.id, userId]
        );
      }
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error("Error saving pages:", err);
    throw err;
  } finally {
    conn.release();
  }
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
async function getSecretCode(page_id, lead_id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [pages] = await connection.execute(
      `SELECT id FROM facebook_pages WHERE page_id = ?`,
      [page_id]
    );

    if (pages.length === 0) {
      await connection.rollback();
      return null; // No matching page found
    }

    const internalPageId = pages[0].id;

    // Step 2: Find the lead based on page_id and secret_code
    const [code] = await connection.execute(
      `SELECT secret_code FROM fb_leads WHERE page_id = ? AND lead_id = ?`,
      [internalPageId, lead_id]
    );

    await connection.commit();

    if (code.length === 0) {
      return null; // No matching lead found
    }

    return code[0]; // Return the lead_data JSON
  } catch (error) {
    await connection.rollback();
    console.error("Error during getting secret code:", error);
    return null;
  } finally {
    connection.release();
  }
}
async function leadAddDb(leadData, lead, idPage, createdAt, string) {
  try {
    const [rows] = await pool.query(
      "INSERT INTO fb_leads (lead_id, lead_data, page_id, form_id, created_at, secret_code) VALUES (?,?,?,?,?,?)",
      [
        lead?.leadgen_id,
        JSON.stringify(leadData),
        idPage,
        lead?.form_id,
        createdAt,
        string,
      ]
    );
    if (rows.affectedRows !== 1) return null;
    else return true;
  } catch (err) {
    console.log("cannot insert the lead", err);
  }
}
async function getPageNotifDetailsWa(page_id) {
  const page_id_str = String(page_id).trim();
  try {
    const [rows] = await pool.query(
      "SELECT wa_sub, notif_number, wa_notif_to_lead, brand_name, website_url FROM client_onboarding WHERE fb_page_id = ?",
      [page_id_str]
    );
    if (rows.length !== 1) return null;
    else return rows[0];
  } catch (err) {
    console.log("Could not find", err);
    return null;
  }
}
module.exports = {
  saveUser,
  savePage,
  subscribe,
  getPageAccessToken,
  leadAddDb,
  getSecretCode,
  getPageNotifDetailsWa,
};
