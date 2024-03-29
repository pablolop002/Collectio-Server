"use strict";

// Load modules
const express = require("express");
const passport = require("../config/auth");
const path = require("path");

// SubRouters
const collections = require("./webApp/collections");
const images = require("./webApp/images");
const users = require("./webApp/user");

// Router
const webApp = express.Router();

webApp.get("/login", function (request, response) {
  response.render("pages/sign-in", { current: "sign-in" });
});

// Google Auth
webApp.get(
  "/login/google",
  passport.authenticate("Google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

webApp.get(
  "/login/google/callback",
  passport.authenticate("Google"),
  function (request, response) {
    response.redirect("/");
  }
);

// Apple Auth
webApp.get("/login/apple", passport.authenticate("Apple"));

webApp.post("/login/apple/callback", function (request, response, next) {
  passport.authenticate("Apple", function (err, user, info) {
    response.redirect("/");
  })(request, response, next);
});

// Microsoft Auth
webApp.get("/login/microsoft", passport.authenticate("Microsoft"));

webApp.get(
  "/login/microsoft/callback",
  passport.authenticate("Microsoft", { failureRedirect: "/login" }),
  function (request, response) {
    response.redirect("/");
  }
);

// Sign Out
webApp.get("/logout", function (request, response, next) {
  request.session.destroy();
  response.redirect("/");
});

// Routes
webApp.use("/collections", collections);
webApp.use("/images", images);
webApp.use("/profile", users);

module.exports = webApp;
