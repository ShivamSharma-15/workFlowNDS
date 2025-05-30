// config/db.js
const mysql = require("mysql2/promise");
const dbConfig = require("./dbConfig");
const dbConfigWeb = require("./dbConfigWeb");

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});
const poolWeb = mysql.createPool({
  host: website_handler,
  user: website_account,
  password: dbConfigWeb.password,
  database: dbConfig.database,
});

module.exports = pool;
