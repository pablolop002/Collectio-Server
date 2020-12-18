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
const usersApi = express.Router();

usersApi.get('/', profiles.none(), function (request, response, next) {
    response.json({
        'status': 'ok',
        'code': 0,
        'data': {
            'Nickname': request.user.Nickname,
            'Mail': request.user.Mail,
            'Image': request.user.Image ? "/images/user" + request.user.Id + "/" + request.user.Image : "/images/default_profile.png",
            'Apple': !!request.user.AppleId,
            'Google': !!request.user.GoogleId
        }
    });
});

usersApi.post('/', profiles.single('Image'), function (request, response, next) {
    let user = request.user;

    if (request.body.Nickname) {
        user.Nickname = request.body.Nickname;
    }

    if (request.body.Mail) {
        user.Mail = request.body.Mail;
    }

    if (request.file != null) {
        user.Image = request.file.filename;
    }

    daoUsers.updateUser(user, function (err, data) {
            if (err) {
                response.json({
                    'status': 'ko',
                    'code': 500,
                    'message': err.message
                });
            } else {
                if (request.file != null && request.user.Image) {
                    fs.removeSync(path.join(__basedir, "storage", "images", "user" + request.user.Id, request.user.Image));
                }

                response.json({
                    'status': 'ok',
                    'code': 1,
                    'message': i18n.__('userUpdateCorrect')
                });
            }
        }
    );
});

usersApi.get('/api-keys', function (request, response, next) {
    daoUsers.listApiKeys(request.user.Id, function (err, data) {
        if (err) {
            response.json({
                'status': 'ko',
                'code': 500,
                'message': err.message
            });
        } else {
            response.json({
                'status': 'ok',
                'code': 1,
                'data': JSON.stringify(data)
            });
        }
    });
});

usersApi.post('/apikey-update', profiles.none(), function (request, response, next) {
    let apikey = {
        'UserId': request.user.Id
    };

    apikey.Token = request.body.Token;

    if (request.body.Device) {
        apikey.Device = request.body.Device;
    }

    if (request.body.FriendlyName) {
        apikey.UserDeviceName = request.body.FriendlyName;
    }

    daoUsers.updateApikey(apikey, function (err, data) {
            if (err) {
                response.json({
                    'status': 'ko',
                    'code': 500,
                    'message': err.message
                });
            } else {
                response.json({
                    'status': 'ok',
                    'code': 1,
                    'message': i18n.__('apikeyUpdateCorrect')
                });
            }
        }
    );
});

usersApi.post('/apikey-delete', profiles.none(), function (request, response, next) {
    let apikey = {
        'UserId': request.user.Id,
        'Token': request.body.Token
    };

    daoUsers.deleteApikey(apikey, function (err, data) {
            if (err) {
                response.json({
                    'status': 'ko',
                    'code': 500,
                    'message': err.message
                });
            } else {
                response.json({
                    'status': 'ok',
                    'code': 1,
                    'message': i18n.__('apikeyDeleteCorrect')
                });
            }
        }
    );
});

module.exports = usersApi;