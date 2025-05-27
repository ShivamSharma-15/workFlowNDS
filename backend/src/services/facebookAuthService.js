const axios = require("axios");
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
          "pages_manage_metadata",
          "pages_manage_ads",
          "pages_show_list",
          "pages_read_engagement",
          "leads_retrieval",
        ],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          // Exchange short-lived user token for a long-lived one
          const { data } = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token`,
            {
              params: {
                grant_type: "fb_exchange_token",
                client_id: process.env.FB_APP_ID,
                client_secret: process.env.FB_APP_SECRET,
                fb_exchange_token: accessToken,
              },
            }
          );

          profile.accessToken = data.access_token;
          return done(null, profile);
        } catch (err) {
          console.error(
            "Error exchanging short-lived token:",
            err.response?.data || err.message
          );
          return done(err);
        }
      }
    )
  );
}

module.exports = { getFacebookStrategy };
