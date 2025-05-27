const express = require("express");
const router = express.Router();
const controller = require("../controllers/metaController");
const path = require("path");
const { showMetaLeadsData } = require("../controllers/leadController");
// const {
//   metaWebhookHandshake,
//   metaWebhookPing,
// } = require("../controllers/metaController");
// router.get("/webhooks", metaWebhookHandshake);
// router.post("/webhooks", express.json(), metaWebhookPing);
// router.get("/oauth", passport.authenticate("facebook"));
// router.get(
//   "/oauth/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/meta/instant-form/oauth/failure",
//     successRedirect: "/meta/instant-form/oauth/success",
//   })
// );

// // Handlers
// router.get("/oauth/success", controller.loginSuccess);
// router.get("/oauth/failure", controller.loginFailure);

router.get("/:clientId", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "frontend",
      "leads",
      "lead-view.html"
    )
  );
});
router.get("/:clientId/lead", showMetaLeadsData);

module.exports = router;
