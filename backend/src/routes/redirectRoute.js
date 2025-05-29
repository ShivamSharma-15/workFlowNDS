const express = require("express");
const router = express.Router();
const redirectValidator = require("../validators/redirectValidator");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const { redirectController } = require("../controllers/generalController");
router.get("/", redirectValidator, handleValidationErrors, redirectController);
module.exports = router;
