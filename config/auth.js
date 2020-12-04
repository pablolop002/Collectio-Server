"use strict";

const conf = require('./conf');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');

passport.use('Google', new GoogleStrategy({
        clientID: conf.googleClientId,
        clientSecret: conf.googleClientSecret,
        callbackURL: 'https://' + conf.domain + '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        // In this example, the user's Google profile is supplied as the user
        // record. In a production-quality application, the Google profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    }
));

/*passport.use('Apple', new AppleStrategy({
    clientID: conf.appleClientId,
    teamID: conf.appleTeamId,
    callbackURL: 'https://' + conf.domain + '/auth/apple/callback',
    keyID: conf.appleCKeyId,
    privateKeyLocation: "",
    passReqToCallback: true
}, function(request, accessToken, refreshToken, decodedIdToken, profile, cb) {
    // Here, check if the decodedIdToken.sub exists in your database!
    // decodedIdToken should contains email too if user authorized it but will not contain the name
    // `profile` parameter is REQUIRED for the sake of passport implementation
    // it should be profile in the future but apple hasn't implemented passing data
    // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
    cb(null, decodedIdToken);
}));*/

// confure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

module.exports = passport;