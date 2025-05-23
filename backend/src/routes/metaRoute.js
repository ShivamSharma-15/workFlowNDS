const express = require("express");
const router = express.Router();
const path = require("path");
const { metaWebhookHandshake } = require("../controllers/metaController");
const { limiter } = require("../middleware/limiter");
// const { loginLimmiters } = require("../middleware/limiter");
// const { login, logout } = require("../controllers/loginController");
// const { travelBot, arDemo } = require("../controllers/demoController");
// const { loginValidationRules } = require("../validators/loginValidators");
// const userSessionAuth = require("../middleware/userSessionAuth");

router.get("/webhooks", limiter, metaWebhookHandshake);

module.exports = router;
