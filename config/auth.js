"use strict";

const passport = require("passport");
const AppleStrategy = require("passport-apple");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;

const conf = require("./conf");
const DAOUser = require("../repositories/DAOUsers");
const database = require("./databases");

const daoUser = new DAOUser(database.pool);

passport.use(
  "Google",
  new GoogleStrategy(
    {
      clientID: conf.googleClientId,
      clientSecret: conf.googleClientSecret,
      callbackURL: conf.domain + "/login/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      daoUser.addOrUpdateGoogle(profile.id, profile.emails[0].value, cb);
    }
  )
);

passport.use(
  "GoogleMobile",
  new GoogleStrategy(
    {
      clientID: conf.googleClientId,
      clientSecret: conf.googleClientSecret,
      callbackURL: conf.domain + "/api/login/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      daoUser.addOrUpdateGoogle(profile.id, profile.emails[0].value, cb);
    }
  )
);

passport.use(
  "Microsoft",
  new MicrosoftStrategy(
    {
      clientID: conf.microsoftClientId,
      clientSecret: conf.microsoftClientSecret,
      callbackURL: conf.domain + "/login/microsoft/callback",
      scope: ["user.read"],
    },
    function (accessToken, refreshToken, profile, cb) {
      daoUser.addOrUpdateMicrosoft(profile.id, profile.emails[0].value, cb);
    }
  )
);

passport.use(
  "MicrosoftMobile",
  new MicrosoftStrategy(
    {
      clientID: conf.microsoftClientId,
      clientSecret: conf.microsoftClientSecret,
      callbackURL: conf.domain + "/api/login/microsoft/callback",
      scope: ["user.read"],
    },
    function (accessToken, refreshToken, profile, cb) {
      daoUser.addOrUpdateMicrosoft(profile.id, profile.emails[0].value, cb);
    }
  )
);

/*passport.use(
  "Apple",
  new AppleStrategy(
    {
      clientID: conf.appleClientId,
      teamID: conf.appleTeamId,
      callbackURL: conf.domain + "/login/apple/callback",
      keyID: conf.appleKeyId,
      privateKeyLocation: path.join(
        __basedir,
        "config",
        conf.applePrivateKeyName
      ),
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, decodedIdToken, profile, cb) {
      daoUser.addOrUpdateApple(decodedIdToken.sub, decodedIdToken.email, cb);
    }
  )
);

passport.use(
  "AppleMobile",
  new AppleStrategy(
    {
      clientID: conf.appleClientId,
      teamID: conf.appleTeamId,
      callbackURL: conf.domain + "/api/login/apple/callback",
      keyID: conf.appleKeyId,
      privateKeyLocation: path.join(
        __basedir,
        "config",
        conf.applePrivateKeyName
      ),
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, decodedIdToken, profile, cb) {
      daoUser.addOrUpdateApple(decodedIdToken.sub, decodedIdToken.email, cb);
    }
  )
);*/

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  cb(null, user.Id);
});

passport.deserializeUser(function (obj, cb) {
  daoUser.getUser(obj, function (err, user) {
    if (err) cb(err);
    else cb(err, user[0]);
  });
});

module.exports = passport;
