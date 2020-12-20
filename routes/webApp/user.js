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
        daoUsers.getUser(request.params.id, function (err, user) {
            if (err) {
                next(err);
            } else {
                /*daoCollections.getCollections(user.Id, null, null, function (err, collections) {
                    if (err) {
                        next(err);
                    } else {
                        response.render('webApp/otherProfile', {
                            'current': 'otherUser',
                            'userInfo': user,
                            'collections': collections
                        });
                    }
                });*/response.redirect("/");
            }
        });
    }
});

usersApp.post('/{:id}', profiles.single('Image'), function (request, response, next) {

});

module.exports = usersApp;