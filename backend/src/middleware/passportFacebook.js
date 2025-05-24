const passport = require("passport");
const { getFacebookStrategy } = require("../services/facebookAuthService");

// Apply only to this route
getFacebookStrategy(passport, "/meta/instant-form/oauth/callback");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
