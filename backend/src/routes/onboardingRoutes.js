const express = require("express");
const router = express.Router();
const path = require("path");
const onboardingValidator = require("../validators/onboardingValidator");
const imageUploadMiddleware = require("../middlewares/imageUploadMiddleware");
const handleValidationErrors = require("../middlewares/handleValidationErrors");
const { onboardClient } = require("../controllers/onboardingController");
router.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "frontend",
      "leads",
      "onboarding.html"
    )
  );
});
router.post(
  "/",
  imageUploadMiddleware,
  onboardingValidator,
  handleValidationErrors,
  onboardClient
);

module.exports = router;
