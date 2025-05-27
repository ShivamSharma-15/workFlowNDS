const pool = require("../config/db");

async function getValidationForLeadEntry(clientId, secretcode) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Get the internal ID of the page from facebook_pages
    const [pages] = await connection.execute(
      `SELECT id FROM facebook_pages WHERE page_id = ?`,
      [clientId]
    );

    if (pages.length === 0) {
      await connection.rollback();
      return null; // No matching page found
    }

    const internalPageId = pages[0].id;

    // Step 2: Find the lead based on page_id and secret_code
    const [leads] = await connection.execute(
      `SELECT lead_data FROM fb_leads WHERE page_id = ? AND secret_code = ?`,
      [internalPageId, secretcode]
    );

    await connection.commit();

    if (leads.length === 0) {
      return null; // No matching lead found
    }

    return leads[0].lead_data; // Return the lead_data JSON
  } catch (error) {
    await connection.rollback();
    console.error("Error during getValidationForLeadEntry:", error);
    return null;
  } finally {
    connection.release();
  }
}

module.exports = { getValidationForLeadEntry };
