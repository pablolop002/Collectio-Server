"use strict";

//
const express = require('express');
const passport = require('../config/auth');
const path = require('path');

//
const users = require('./webApp/user');
//const collections = require('./webApp/collections');

// Router
const webApp = express.Router();

// Google Auth
webApp.get('/login/google', passport.authenticate('Google',
    {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
    }));

webApp.get('/login/google/callback', passport.authenticate('Google'), function (request, response) {
    response.redirect('/');
});

// Apple Auth
webApp.get("/login/Apple", passport.authenticate('Apple'));

webApp.post("/login/Apple/callback", function (request, response, next) {
    passport.authenticate('Apple', function (err, user, info) {
        response.redirect('/');
    })(request, response, next);
});

// Redirect if not logged
webApp.use(function (request, response, next) {
    if (request.user) {
        next();
    } else {
        response.redirect("/");
    }
});

// Static user resources
webApp.use('/images', express.static(path.join(__basedir, 'storage', 'images')));

// SignOut
webApp.get('/logout', function (request, response, next) {
    request.session.destroy();
    response.redirect('/');
});

// Use Routers
webApp.use('/profile', users);
//webApp.use('/collections', collections);

module.exports = webApp;