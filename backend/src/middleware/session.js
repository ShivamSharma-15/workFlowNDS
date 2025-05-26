const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();
const dbConfig = require("../config/dbConfig");

const sessionStore = new MySQLStore({
  host: dbConfig.host,
  port: process.env.DB_PORT,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

const sessionMiddleware = session({
  key: "user_id",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  createDatabaseTable: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  },
});

module.exports = sessionMiddleware;
