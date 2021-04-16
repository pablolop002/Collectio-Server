"use strict";

// Load modules
const express = require('express');
const fs = require('fs-extra');
const i18n = require('i18n');
const multer = require('multer');
const path = require('path');

// Config
const database = require('../../config/databases');
const itemImages = multer({
    storage: multer.diskStorage({
        destination: (request, file, callback) => {
            let dest = path.join(__basedir, "storage", "images", "user" + request.user.Id, "collection" + request.collection.Id, "temp");
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
const DAOCollections = require('../../repositories/DAOCollections');
const DAOItems = require('../../repositories/DAOItems');

// Function instances
const daoCollections = new DAOCollections(database.pool);
const daoItems = new DAOItems(database.pool);

// Router
const collectionsApp = express.Router();

// Error if not logged
collectionsApp.use(function (request, response, next) {
    if (request.user) {
        next();
    } else {
        response.status(403);
        response.render('pages/error', {'current': 'error', 'errorCode': 403});
    }
});

// Routes

module.exports = collectionsApp;