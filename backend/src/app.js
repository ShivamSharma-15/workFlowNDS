// app.js
const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./middleware/session");
const { limiter } = require("./middleware/limiter");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
  })
);
app.set("trust proxy", 1);
app.use(sessionMiddleware);
// Routes for meta
const metaWebhookRoute = require("./routes/metaRoute.js");
const normalRoutes = require("./routes/normalRoutes.js");
app.use("/meta/instant-form", metaWebhookRoute);
app.use("/", normalRoutes);

const path = require("path");
app.use(
  express.static(path.join(__dirname, "..", "..", "frontend", "landing"))
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:3000");
});
