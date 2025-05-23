const rateLimit = require("express-rate-limit");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, //24 hr limit on site access
  max: process.env.NODE_ENV === "production" ? 20 : 10,
  message: {
    error: "Your daily quota is finished",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
};
