"use strict";

// Load modules
const fs = require("fs-extra");
const i18n = require("i18n");
const path = require("path");

module.exports = {
  fileName: function (req, file, cb) {
    cb(null, file.originalname);
  },
  fileFormat: function (req, file, cb) {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error(i18n.__("fileFormatNotValid")), false);
    }
  },
  collectionImageTempDest: function (request, file, callback) {
    let dest = path.join(
      __basedir,
      "storage",
      "images",
      "user" + request.user.Id,
      "temp"
    );
    fs.mkdirsSync(dest);
    callback(null, dest);
  },
  collectionImageDest: function (request, file, callback) {
    let dest = path.join(
      __basedir,
      "storage",
      "images",
      "user" + request.user.Id,
      "collection" + request.collection.ServerId
    );
    fs.mkdirsSync(dest);
    callback(null, dest);
  },
  itemImageTempDest: function (request, file, callback) {
    let dest = path.join(
      __basedir,
      "storage",
      "images",
      "user" + request.user.Id,
      "collection" + request.collection.ServerId,
      "temp"
    );
    fs.mkdirsSync(dest);
    callback(null, dest);
  },
  itemImageDest: function (request, file, callback) {
    let dest = path.join(
      __basedir,
      "storage",
      "images",
      "user" + request.user.Id,
      "collection" + request.collection.ServerId,
      "item" + request.item.ServerId
    );
    fs.mkdirsSync(dest);
    callback(null, dest);
  },
  responseOk: function (response, data, message = "") {
    response.json({
      status: "ok",
      code: 1,
      message: message,
      data: data,
    });
  },
  responseKo: function (
    response,
    code = this.responseCodes.internalError,
    message = ""
  ) {
    response.json({
      status: "ko",
      code: code,
      message: message,
    });
  },
  responseCodes: Object.freeze({
    ok: 1,
    notAllowed: 403,
    notFound: 404,
    internalError: 500,
  }),
};
