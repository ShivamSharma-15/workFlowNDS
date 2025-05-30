const express = require("express");
const router = express.Router();
const { verifyApiKey } = require("../middleware/verifyApiKey");
const { newFormWebsite } = require("../controllers/externalLeadController");
router.post("/new-lead", verifyApiKey, express.json(), newFormWebsite);
module.exports = router;
