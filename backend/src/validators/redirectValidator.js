const { query } = require("express-validator");

module.exports = [
  query("url")
    .exists()
    .withMessage("Missing url parameter")
    .bail()
    .isURL({ require_protocol: true, protocols: ["https"] })
    .withMessage("Invalid or insecure URL. Only HTTPS URLs are allowed."),
];
