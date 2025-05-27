const {
  saveUser,
  savePage,
  subscribe,
  leadAddDb,
  getPageAccessToken,
} = require("../model/fbModel");
require("dotenv").config();
const axios = require("axios");
async function getFbUser(userAccessToken, userName) {
  const saveUsers = saveUser(userAccessToken, userName);
  return saveUsers;
}
async function getFbPages(pages, savedUser) {
  try {
    await savePage(pages, savedUser);
    console.log("All pages saved successfully.");
    return true;
  } catch (error) {
    console.error("Error saving pages:", error);
    return false;
  }
}
async function isSubbed(successfulSubs) {
  try {
    await subscribe(successfulSubs);
    console.log("All pages subbed successfully.");
    return true;
  } catch (error) {
    console.error("Error subbing pages:", error);
    return false;
  }
}
async function getAllFbPages(userAccessToken) {
  const pagesResponse = await axios.get(
    "https://graph.facebook.com/v22.0/me/accounts",
    {
      params: {
        access_token: userAccessToken,
      },
    }
  );
  const pages = pagesResponse.data.data;
  if (pages) {
    return pages;
  } else return null;
}
async function subscribeToAllPages(pages) {
  const subscriptionResults = await Promise.all(
    pages.map(async (page) => {
      try {
        await axios.post(
          `https://graph.facebook.com/v22.0/${page.id}/subscribed_apps`,
          null,
          {
            params: {
              access_token: page.access_token,
              subscribed_fields: "leadgen",
            },
          }
        );
        return { page: page.name, pageId: page.id, success: true };
      } catch (err) {
        return {
          page: page.name,
          pageId: page.id,
          success: false,
          error: err.response?.data || err.message,
        };
      }
    })
  );
  const successfulSubs = subscriptionResults.filter((r) => r.success);
  if (successfulSubs) {
    return successfulSubs;
  } else {
    return null;
  }
}
async function leadAdded(lead) {
  try {
    const leadgen_id = lead?.leadgen_id;
    const page_id = lead?.page_id;
    if (!leadgen_id || !page_id) {
      console.warn("Missing leadgen_id or page_id");
      return null;
    }

    const pageAccessTokenRow = await getPageAccessToken(page_id);
    const pageAccessToken = pageAccessTokenRow.page_access_token;
    const idPage = pageAccessTokenRow.id;

    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${leadgen_id}`,
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );

    const leadData = response.data;

    if (!leadData || !leadData.id) {
      console.warn("Lead data from Graph API is missing expected fields");
      return null;
    }
    const createdAt = formatToMySQLDateTime(lead?.created_time);
    const leadDataToDB = await leadAddDb(leadData, lead, idPage, createdAt);
    if (leadDataToDB) {
      return leadData;
    } else return false;
  } catch (error) {
    console.error(
      "leadAdded error:",
      error.response?.data || error.message || error
    );
    return null;
  }
}
async function sendWhatsappUpdate(lead, leadAdd) {
  const page_id = lead?.page_id;
  const pageAccessTokenRow = await getPageAccessToken(page_id);
  const pageAccessToken = pageAccessTokenRow.page_access_token;
  const form_id = lead?.form_id;
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${form_id}`,
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );
    console.log(response);
    formData = response.data;
    formName = formData.name;
    formatData = formattingLead(leadAdd);
    formatContact = extractContactInfo(leadAdd);
    const messageSent = await whatsappMessageSender(
      formName,
      formatData,
      formatContact
    );
  } catch (error) {
    console.log("Error Sending message", error);
    return null;
  }
}
async function whatsappMessageSender(formName, formatData, formatContact) {
  const accessToken = process.env.WA_TOKEN;
  const leadDetails = formatData.join(" || ");
  const data = {
    messaging_product: "whatsapp",
    to: "917697876527",
    type: "template",
    template: {
      name: "instant_form_received",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", parameter_name: "form_name", text: formName },
            {
              type: "text",
              parameter_name: "name",
              text: formatContact.fullName,
            },
            {
              type: "text",
              parameter_name: "number",
              text: formatContact.phoneNumber,
            },
            { type: "text", parameter_name: "details", text: leadDetails },
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(
      "https://graph.facebook.com/v22.0/539610682577776/messages",
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Message sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
}
function formatToMySQLDateTime(input) {
  const date = new Date(typeof input === "number" ? input * 1000 : input);
  return date.toISOString().slice(0, 19).replace("T", " ");
}
function formattingLead(leadData) {
  if (!leadData || !Array.isArray(leadData.field_data)) {
    return [];
  }

  const formattedFields = leadData.field_data.map((field) => {
    let name = field.name || "Unknown Field";
    let values = field.values || [];

    const flatValues = values.flatMap((val) =>
      typeof val === "string" ? val.split(",").map((v) => v.trim()) : []
    );

    const cleanedName = name
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[^a-zA-Z0-9 ?!]/g, "")
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return `${cleanedName}: ${flatValues.join(", ")}`;
  });

  return formattedFields;
}
function extractContactInfo(leadData) {
  if (!leadData || !Array.isArray(leadData.field_data)) {
    return {};
  }

  let fullName = null;
  let phoneNumber = null;
  let email = null;

  leadData.field_data.forEach((field) => {
    switch (field.name) {
      case "full_name":
        fullName = field.values?.[0] || null;
        break;
      case "phone_number":
        phoneNumber = field.values?.[0] || null;
        break;
      case "email":
        email = field.values?.[0] || null;
        break;
    }
  });

  return { fullName, phoneNumber, email };
}

module.exports = {
  getFbUser,
  getFbPages,
  isSubbed,
  getAllFbPages,
  subscribeToAllPages,
  leadAdded,
  sendWhatsappUpdate,
};
