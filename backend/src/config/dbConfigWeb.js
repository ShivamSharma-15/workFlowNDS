require("dotenv").config();

const requiredVars = ["DB_WEB_HOST", "DB_WEB_USER", "DB_WEB_PASS", "DB_NAME"];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  host: process.env.DB_WEB_HOST,
  user: process.env.DB_WEB_USER,
  password: process.env.DB_WEB_PASS,
  database: process.env.DB_NAME,
};
