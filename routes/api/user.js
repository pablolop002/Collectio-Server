"use strict";

// Load modules
const express = require("express");
const fs = require("fs-extra");
const i18n = require("i18n");
const multer = require("multer");
const path = require("path");

// Config
const database = require("../../config/databases");
const profiles = multer({
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      let dest = path.join(
        __basedir,
        "storage",
        "images",
        "user" + request.user.Id
      );
      fs.mkdirsSync(dest);
      callback(null, dest);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error(i18n.__("fileFormatNotValid")), false);
      }
    },
  }),
});

// Function includes
const DAOUsers = require("../../repositories/DAOUsers");

// Function instances
const daoUsers = new DAOUsers(database.pool);

// Router
const usersApi = express.Router();

usersApi.get("/", function (request, response, next) {
  response.json({
    status: "ok",
    code: 1,
    data: {
      ServerId: request.user.UserId,
      Nickname: request.user.Nickname,
      Mail: request.user.Mail,
      Image: request.user.Image ? request.user.Image : null,
      Apple: !!request.user.AppleId,
      Google: !!request.user.GoogleId,
    },
  });
});

usersApi.post(
  "/",
  profiles.single("Images"),
  function (request, response, next) {
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
        next(err);
      } else {
        if (request.file != null && request.user.Image) {
          fs.removeSync(
            path.join(
              __basedir,
              "storage",
              "images",
              "user" + request.user.Id,
              request.user.Image
            )
          );
        }
        daoUsers.getUser(user.Id, function (err, updatedUser) {
          if (err) {
            response.json({
              status: "ok",
              code: 1,
              message: i18n.__("userUpdate"),
            });
          } else {
            response.json({
              status: "ok",
              code: 1,
              message: i18n.__("userUpdate"),
              data: {
                Nickname: updatedUser[0].Nickname,
                Mail: updatedUser[0].Mail,
                Image: updatedUser[0].Image ? updatedUser[0].Image : null,
                Apple: !!updatedUser[0].AppleId,
                Google: !!updatedUser[0].GoogleId,
              },
            });
          }
        });
      }
    });
  }
);

usersApi.delete("/image", function (request, response, next) {
  let user = request.user;
  user.Image = null;

  daoUsers.updateUser(user, function (err, data) {
    if (err) {
      next(err);
    } else {
      fs.removeSync(
        path.join(
          __basedir,
          "storage",
          "images",
          "user" + request.user.Id,
          request.user.Image
        )
      );

      response.json({
        status: "ok",
        code: 1,
        message: i18n.__("userUpdate"),
        data: {
          Nickname: user.Nickname,
          Mail: user.Mail,
          Image: null,
          Apple: !!user.AppleId,
          Google: !!user.GoogleId,
        },
      });
    }
  });
});

usersApi.get("/api-keys", function (request, response, next) {
  daoUsers.listApiKeys(request.user.Id, function (err, data) {
    if (err) {
      next(err);
    } else {
      response.json({
        status: "ok",
        code: 1,
        data: data,
      });
    }
  });
});

usersApi.post("/api-keys", profiles.none(), function (request, response, next) {
  let apikey = {
    UserId: request.user.Id,
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
      next(err);
    } else {
      response.json({
        status: "ok",
        code: 1,
        message: i18n.__("apikeyUpdate"),
      });
    }
  });
});

usersApi.delete("/api-keys/:token", function (request, response, next) {
  let apikey = {
    UserId: request.user.Id,
    Token: request.params.token,
  };

  daoUsers.deleteApikey(apikey, function (err, data) {
    if (err) {
      next(err);
    } else {
      response.json({
        status: "ok",
        code: 1,
        message: i18n.__("apikeyDelete"),
      });
    }
  });
});

module.exports = usersApi;
