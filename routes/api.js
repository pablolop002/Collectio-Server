"use strict";

// Load modules
const express = require('express');
const multer = require("multer");
//const mysql = require('mysql');
const passport = require("passport");

// Config
const database = require('../config/databases');
//const passport = require('../config/auth');
const upload = multer();

// Function includes
const DAOUsers = require("../repositories/DAOUsers");
const DAOGroups = require("../repositories/DAOGroups");
const DAOCollections = require("../repositories/DAOCollections");
const DAOItems = require("../repositories/DAOItems");

// Function instances
const daoUsers = new DAOUsers(database.pool);
const daoGroups = new DAOGroups(database.pool);
//const daoCollections = new DAOCollections(database.pool);
const daoItems = new DAOItems(database.pool);

// Router
const api = express.Router();

// Check Authorization
api.use(function (req, res, next) {
    let token = req.header('Authorization');

    if (!token || token !== "") {
        next(new Error("No auth key"));
    }

    next();
});

// Google API Auth
api.get('/google', passport.authenticate('Google', {scope: ['profile']}));

api.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// Apple API Auth
api.get("/apple", passport.authenticate('Apple'));

// Check Session
api.use(function (req, res, next) {
    let apikey = req.header('apikey');
    if (apikey != null) {
        daoUsers.existApikey(apikey, function (err, user) {
            if (err) {
                next(err);
            } else {
                if (user != null) {
                    req.User = user;
                    next();
                } else {
                    next(new Error("No existe el usuario"));
                }
            }
        });
    } else {
        next(new Error("No apikey"));
    }
});

// Routes
//api.use('/user', apiUserRouter);
//api.use('/collections', apiUserRouter);
//api.use('/user', apiUserRouter);

// Urls
api.get('/', function (req, res, next) {
    res.json(null);
});

api.use(function (error, request, response, next) {
    response.status(403);
    response.render("error", {errorCode: 403});
});

module.exports = api;