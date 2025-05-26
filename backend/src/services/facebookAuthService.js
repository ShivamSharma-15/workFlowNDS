require("dotenv").config();

const FacebookStrategy = require("passport-facebook").Strategy;

function getFacebookStrategy(passport, callbackURL) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL,
        profileFields: ["id", "displayName", "emails"],
        scope: [
          "pages_show_list",
          "pages_read_engagement",
          "leads_retrieval",
          "pages_manage_ads",
        ],
      },
      function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        return done(null, profile);
      }
    )
  );
}

module.exports = { getFacebookStrategy };
