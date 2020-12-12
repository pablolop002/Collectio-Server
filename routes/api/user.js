"use strict";

// Load modules
const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');

// Config
const conf = require('../../config/conf');
const database = require('../../config/databases');
const passport = require('../../config/auth');
const profiles = multer({
    dest: (request, file, callback) => {
        let path = "../../storage/user-data/user" + request.user.Id;
        fs.mkdirsSync(path);
        callback(null, path);
    }
});

// Function includes
const DAOUsers = require('../../repositories/DAOUsers');
const i18n = require("i18n");

// Function instances
const daoUsers = new DAOUsers(database.pool);

// Router
const usersApi = express.Router();

usersApi.get('/user', profiles.none(), function (request, response, next) {
    response.json({
        'status': 'ok',
        'code': 0,
        'data': {
            'Nickname': request.user.Nickname,
            'Mail': request.user.Mail,
            'Image': request.user.Image,
            'Apple': request.user.Apple ? true : false,
            'Google': request.user.Google ? true : false
        }
    });
});

usersApi.post('/user', profiles.single('image'), function (request, response, next) {
    let user = {
        'Id': request.user.Id
    };

    if (request.body.nickname) {
        user.Nickname = request.body.nickname;
    } else {
        user.Nickname = request.user.Nickname;
    }

    if (request.body.mail) {
        user.Mail = request.body.mail;
    } else {
        user.Mail = request.user.Mail;
    }

    if (request.file != null) {
        user.Image = request.file.filename;
    }

    daoUsers.updateUser(user, function (err, data) {
            if (err) {
                response.json({
                    'status': 'ko',
                    'code': 500,
                    'message': JSON.stringify(err)
                });
            } else {

                response.json({
                    'status': 'ok',
                    'code': 1,
                    'message': i18n.__('userUpdateCorrect')
                });
            }
        }
    );
});

module.exports = usersApi;