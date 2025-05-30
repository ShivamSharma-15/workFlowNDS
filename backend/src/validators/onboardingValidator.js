const { body } = require("express-validator");

const onboardingValidator = [
  body("nameF")
    .notEmpty()
    .withMessage("Client name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name must contain only letters")
    .isLength({ max: 50 })
    .withMessage("Name too long"),

  body("brandNameF")
    .notEmpty()
    .withMessage("Brand name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Brand name must contain only letters")
    .isLength({ max: 50 })
    .withMessage("Brand name too long"),

  body("numberF")
    .notEmpty()
    .withMessage("Contact number is required")
    .isLength({ max: 10 })
    .withMessage("Contact number must be 10 digits max")
    .matches(/^\d+$/)
    .withMessage("Contact number must contain only digits"),

  body("emailF")
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Invalid contact email")
    .isLength({ max: 100 })
    .withMessage("Email too long"),

  body("fbPageIdF")
    .notEmpty()
    .withMessage("FB Page ID is required")
    .isAlphanumeric()
    .withMessage("FB Page ID must be alphanumeric")
    .isLength({ max: 50 })
    .withMessage("FB Page ID too long"),

  body("subEmailF")
    .notEmpty()
    .withMessage("subEmailF is required")
    .isBoolean()
    .withMessage("subEmailF must be true or false"),

  body("subWAF")
    .notEmpty()
    .withMessage("subWAF is required")
    .isBoolean()
    .withMessage("subWAF must be true or false"),

  body("recEmailF")
    .if((value) => value && value !== "null") // only run below rules if non-empty and not "null"
    .isEmail()
    .withMessage("Invalid recipient email")
    .isLength({ max: 100 }),
  body("ccEmailF")
    .if((value) => value && value !== "null")
    .customSanitizer((value) =>
      value
        .split(",")
        .map((v) => v.trim())
        .join(",")
    )
    .custom((value) => {
      const emails = value.split(",");
      for (let email of emails) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error(`Invalid email in ccEmailF: ${email}`);
        }
      }
      return true;
    }),

  body("sendEmailToLeadF")
    .notEmpty()
    .withMessage("sendEmailToLeadF is required")
    .isBoolean()
    .withMessage("sendEmailToLeadF must be true or false"),

  body("waSubbedNumberF")
    .if((value) => value && value !== "null")
    .customSanitizer((value) =>
      value
        .split(",")
        .map((v) => v.trim())
        .join(",")
    )
    .custom((value) => {
      const numbers = value.split(",");
      for (let num of numbers) {
        if (!/^\d{12}$/.test(num)) {
          throw new Error(`Invalid number in waSubbedNumberF: ${num}`);
        }
      }
      return true;
    }),

  body("sendWaToLeadF")
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage("sendWaToLeadF must be true or false"),
  body("websiteURLF")
    .notEmpty()
    .withMessage("Website URL is required")
    .bail()
    .custom((value) => {
      if (typeof value !== "string") {
        throw new Error("Website URL must be a string");
      }

      const trimmed = value.trim();

      let url;
      try {
        url = new URL(trimmed);
      } catch {
        throw new Error("Invalid URL format");
      }

      if (url.protocol !== "https:") {
        throw new Error("URL must use HTTPS");
      }

      if (url.search || url.hash) {
        throw new Error("URL must not contain query parameters or hash");
      }

      return true;
    })
    .customSanitizer((value) => {
      const url = new URL(value.trim());
      return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
    }),
];

module.exports = onboardingValidator;
