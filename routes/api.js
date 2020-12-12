"use strict";

// Load modules
const express = require('express');
const multer = require('multer');

// Config
const conf = require('../config/conf');
const database = require('../config/databases');
const passport = require('../config/auth');
const upload = multer();

// Function includes
const DAOUsers = require('../repositories/DAOUsers');
const DAOCategories = require('../repositories/DAOCategories');
const DAOCollections = require('../repositories/DAOCollections');
const DAOItems = require('../repositories/DAOItems');
const i18n = require("i18n");

// Function instances
const daoUsers = new DAOUsers(database.pool);
const daoCategories = new DAOCategories(database.pool);
const daoCollections = new DAOCollections(database.pool);
const daoItems = new DAOItems(database.pool);

// Router
const api = express.Router();

// Google API Auth
api.get('/login/google', passport.authenticate('GoogleMobile', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}));

api.get('/login/google/callback', passport.authenticate('GoogleMobile'), function (request, response) {
    daoUsers.createApikey(request.user.Id, function (err, token) {
        if (err) {
            response.redirect('collectioapp://#?err=' + err);
        } else {
            response.redirect('collectioapp://#?token=' + token.token);
        }
    });
});

// Apple API Auth
api.get('/login/apple', passport.authenticate('AppleMobile'));

api.post('/login/apple/callback', function (request, response, next) {
    passport.authenticate('AppleMobile', function (err, user, info) {
        if (err) {
            response.redirect('collectioapp://#?err=' + err);
        } else {
            daoUsers.createApikey(user.Id, function (err, token) {
                if (err) {
                    response.redirect('collectioapp://#?err=' + err);
                } else {
                    response.redirect('collectioapp://#?token=' + token.token);
                }
            });
        }
    })(request, response, next);
});

// Check Authorization
api.use(function (request, response, next) {
    let token = request.header('Authorization'),
        lang = request.header('lang');

    if (!token || token !== conf.authApi) {
        next(new Error(i18n.__('noApiAuth')));
    }

    request.mobileAuth = true;

    if (lang) {
        i18n.setLocale(lang);
    }

    next();
});

api.get('/categories', function (request, response, next) {
    daoCategories.listCategories(function (err, categories) {
        if (err) {
            response.json({
                'status': 'ko',
                'code': 500,
                'message': JSON.stringify(err)
            });
        } else {
            response.json({
                'status': 'ok',
                'code': 0,
                'data': JSON.stringify(categories)
            });
        }
    })
});

api.get('/subcategories', function (request, response, next) {
    daoCategories.listSubcategories(function (err, subcategories) {
        if (err) {
            response.json({
                'status': 'ko',
                'code': 500,
                'message': JSON.stringify(err)
            });
        } else {
            response.json({
                'status': 'ok',
                'code': 0,
                'data': JSON.stringify(subcategories)
            });
        }
    })
});

// Check Session
api.use(function (request, response, next) {
    let apikey = request.header('apikey');
    if (apikey != null) {
        daoUsers.existApikey(apikey, function (err, user) {
            if (err) {
                response.json({
                    'status': 'ko',
                    'code': 500,
                    'message': JSON.stringify(err)
                });
            } else {
                if (user != null) {
                    request.user = user;
                    next();
                } else {
                    next(new Error(i18n.__('userNotFound')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noApiKey')));
    }
});

// Routes
//api.use('/user', apiUserRouter);
//api.use('/collections', apiUserRouter);
//api.use('/user', apiUserRouter);

// Error 404
api.use(function (request, response, next) {
    response.json({
        'status': 'ko',
        'code': 404
    });
});

// Error 403
api.use(function (error, request, response, next) {
    if (request.mobileAuth) {
        response.json({
            'status': 'ko',
            'code': 403,
            'message': error
        });
    } else {
        response.status(403);
        response.render('error', {'current': 'error', 'errorCode': 403});
    }
});

module.exports = api;