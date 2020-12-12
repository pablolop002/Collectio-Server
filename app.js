"use strict";

// Set __basedir
global.__basedir = __dirname;

// Load Modules
const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const fs = require('fs');
const i18n = require('i18n');
const multer = require('multer');
const path = require('path');

// Config
const database = require('./config/databases');
const passport = require('./config/auth');
const locales = require('./config/locales');
const upload = multer();

// Routers
const webRouter = require('./routes/collectio');
const apiRouter = require('./routes/api');

// ExpressJS Server creation
const app = express();

// ExpressJS Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static resources
app.use(express.static(path.join(__dirname, 'public')));
app.use('/categories', express.static(path.join(__dirname, 'storage', 'categories')));

// Lang Service
i18n.configure(locales.lang);
app.use(i18n.init);

// Express Session
app.use(expressSession({
    saveUninitialized: false,
    secret: "CatsCollectionIsMyFav",
    resave: false,
    store: database.sessionStore
}));

// Body Parser
app.use(bodyParser.urlencoded({extended: true}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(function (request, response, next) {
    if (request.user) {
        response.locals.user = request.user;
    }
    next();
});

// Static pages
app.get('/', upload.none(), function (request, response, next) {
    response.render('index', {'current': 'index'});
});

app.get('/about', upload.none(), function (request, response, next) {
    response.render('about', {'current': 'about'});
});

app.get('/privacy-policy', upload.none(), function (request, response, next) {
    response.render('privacy-policy', {'current': 'privacy'});
});

app.get('/terms', upload.none(), function (request, response, next) {
    response.render('terms', {'current': 'terms'});
});

app.get('/legal-notice', upload.none(), function (request, response, next) {
    response.render('legal-notice', {'current': 'legal'});
});

app.get('/cookies', upload.none(), function (request, response, next) {
    response.render('cookies', {'current': 'cookies'});
});

app.get('/login/google', passport.authenticate('Google',
    {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
    }));

app.get('/login/google/callback', passport.authenticate('Google'), function (request, response) {
    response.redirect('/');
});

// Apple API Auth
app.get("/login/apple", passport.authenticate('Apple'));

app.post("/login/apple/callback", function (request, response, next) {
    passport.authenticate('Apple', function (err, user, info) {
        response.redirect('/');
    })(request, response, next);
});

app.get('/logout', upload.none(), function (request, response, next) {
    request.session.destroy();
    response.redirect('/');
});

// Routes
app.use('/api', apiRouter);
//app.use('/portal', webRouter);

// Error 404
app.use(function (request, response, next) {
    response.status(404);
    response.render('error', {'current': 'error', 'errorCode': 404});
});

// Error 500
app.use(function (error, request, response, next) {
    let route = path.join('storage', 'logs', Date.now().toString() + '.log');
    let doc = error.message + '\n' + error.stack;

    fs.writeFile(route, doc, function (err) {
        response.status(500);
        if (err)
            response.render('error', {'current': 'error', 'errorCode': 500, 'file': i18n.__('noErrorFile')});
        else
            response.render('error', {'current': 'error', 'errorCode': 500, 'file': route});
    });
});

module.exports = app;
