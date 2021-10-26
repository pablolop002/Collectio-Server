"use strict";

// Load modules
const express = require("express");
const path = require("path");

// Router
const adminApp = express.Router();

// Error if not logged
adminApp.use(function (request, response, next) {
  if (request.user && request.user.IsAdmin) {
    next();
  } else {
    response.status(403);
    response.render("error", { current: "error", errorCode: 403 });
  }
});

// Static user resources
adminApp.get("/", function (request, response) {
  response.render("pages/admin", { current: "admin" });
});

adminApp.get("/categories", function (request, response) {
  response.render("pages/categories", { current: "categories" });
});

module.exports = adminApp;
