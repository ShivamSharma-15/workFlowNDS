// app.js
const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./middleware/session");
const { limiter } = require("./middleware/limiter");
// const helmet = require("helmet");
require("dotenv").config();

const app = express();

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "https://trusted.cdn.com"],
//       styleSrc: ["'self'", "https://fonts.googleapis.com"],
//       imgSrc: ["'self'", "data:"],
//       connectSrc: ["'self'", "http://localhost:3000"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       objectSrc: ["'none'"],
//     },
//   })
// );
app.set("trust proxy", 1);
app.use(sessionMiddleware);
// Routes for meta
const metaWebhookRoute = require("./routes/metaRoute.js");
app.use("/meta/instant-form", metaWebhookRoute);

// const path = require("path");
// app.use(
//   express.static(path.join(__dirname, "..", "..", "frontend", "landing"))
// );
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:3000");
});
