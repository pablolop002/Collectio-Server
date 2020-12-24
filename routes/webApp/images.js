"use strict";

// Load modules
const express = require('express');

// Router
const imagesApp = express.Router();

// Error if not logged
imagesApp.use(function (request, response, next) {
    if (request.user) {
        next();
    } else {
        response.status(403);
        response.render('error', {'current': 'error', 'errorCode': 403});
    }
});

// Static user resources
imagesApp.use('/images', express.static(path.join(__basedir, 'storage', 'images')));

module.exports = imagesApp;