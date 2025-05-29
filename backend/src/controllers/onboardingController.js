require("dotenv").config();
const { processOnboardingData } = require("../services/onboardingService");
const onboardClient = async (req, res) => {
  try {
    const result = await processOnboardingData(req.body, req.file);
    console.log(result);
    res.status(200).json({ message: "Onboarding data saved", data: result });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { onboardClient };
