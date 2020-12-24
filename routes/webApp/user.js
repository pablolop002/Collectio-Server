"use strict";

// Load modules
const express = require('express');
const fs = require('fs-extra');
const i18n = require('i18n');
const multer = require('multer');
const path = require('path');

// Config
const database = require('../../config/databases');
const profiles = multer({
    storage: multer.diskStorage({
        destination: (request, file, callback) => {
            let dest = path.join(__basedir, "storage", "images", "user" + request.user.Id);
            fs.mkdirsSync(dest);
            callback(null, dest);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error(i18n.__('fileFormatNotValid')));
            }
        }
    })
});

// Function includes
const DAOUsers = require('../../repositories/DAOUsers');

// Function instances
const daoUsers = new DAOUsers(database.pool);

// Router
const usersApp = express.Router();

// Error if not logged
usersApp.use(function (request, response, next) {
    if (request.user) {
        next();
    } else {
        response.status(403);
        response.render('error', {'current': 'error', 'errorCode': 403});
    }
});

usersApp.get('/:id*?', function (request, response, next) {
    if (!request.params.id || request.params.id === request.user.Id) {
        daoUsers.listApiKeys(request.user.Id, function (err, apiKeys) {
            if (err) {
                next(err);
            } else {
                response.render('webApp/myProfile', {'current': 'profile', 'apiKeys': apiKeys});
            }
        });
    } else {
        response.redirect("/users/" + request.params.id);
    }
});

usersApp.post('/', profiles.single('profile[Image]'), function (request, response, next) {
    request.body.profile.Id = request.user.Id;
    daoUsers.updateUser(request.body.profile, function (err, data) {

    });
});

usersApp.post('/delete-apikey', profiles.none(), function (request, response, next) {
    request.body.apikey.UserId = request.user.Id;
    daoUsers.updateApikey(request.body.apikey, function (err, data) {
        if (err) {
            next(err);
        } else {
            response.redirect('/profile');
        }
    });
});

usersApp.post('/update-apikey', profiles.none(), function (request, response, next) {
    request.body.apikey.UserId = request.user.Id;
    daoUsers.deleteApikey(request.body.apikey, function (err, data) {
        if (err) {
            next(err);
        } else {
            response.redirect('/profile');
        }
    });
});

module.exports = usersApp;