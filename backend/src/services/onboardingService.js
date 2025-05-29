const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { saveOnboardingClient } = require("../model/onboardingClientModel");

const processOnboardingData = async (fields, file) => {
  if (!file) {
    throw new Error("Image file is required.");
  }

  const uploadDir = path.join(__dirname, "..", "clientAssets", "brandImages");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(3).toString("hex"); // 6 hex characters
  const ext = path.extname(file.originalname).toLowerCase();
  const safeFbId = fields.fbPageId.replace(/[^a-zA-Z0-9]/g, "");

  const customFileName = `${safeFbId}_${timestamp}_${randomStr}${ext}`;
  const destinationPath = path.join(uploadDir, customFileName);

  try {
    // Move file from temp to final destination
    fs.renameSync(file.path, destinationPath);

    const fullData = {
      name: fields.nameF,
      email: fields.emailF,
      number: fields.numberF,
      fbPageId: fields.fbPageIdF,
      emailSub: fields.subEmailF === "true" || fields.subEmailF === true,
      recEmail: fields.recEmailF || null,
      ccEmail: fields.ccEmailF || null,
      emailNotifToLead:
        fields.sendEmailToLeadF === "true" || fields.sendEmailToLeadF === true,
      waSub: fields.subWAF === "true" || fields.subWAF === true,
      notifNumber: fields.waSubbedNumberF || null,
      waNotifToLead:
        fields.sendWaToLeadF === "true" || fields.sendWaToLeadF === true,
      imageFileName: customFileName,
    };
    // Save to DB via model
    const dbResult = await saveOnboardingClient(fullData);

    return dbResult;
  } catch (err) {
    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    throw err;
  }
};

module.exports = { processOnboardingData };
