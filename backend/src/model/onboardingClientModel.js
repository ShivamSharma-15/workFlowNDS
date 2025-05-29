const pool = require("../config/db");

const saveOnboardingClient = async (data) => {
  const {
    name,
    email,
    number,
    fbPageId,
    imageFileName,
    emailSub,
    recEmail,
    ccEmail,
    emailNotifToLead,
    waSub,
    notifNumber,
    waNotifToLead,
  } = data;

  const sql = `
    INSERT INTO client_onboarding (
      name,
      email,
      number,
      fb_page_id,
      brand_image_location,
      email_sub,
      rec_email,
      cc_email,
      email_notif_to_lead,
      wa_sub,
      notif_number,
      wa_notif_to_lead
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    email,
    number,
    fbPageId,
    imageFileName,
    emailSub,
    recEmail || null,
    ccEmail || null,
    emailNotifToLead,
    waSub,
    notifNumber || null,
    waNotifToLead,
  ];

  const [result] = await pool.execute(sql, values);
  return result;
};

module.exports = { saveOnboardingClient };
