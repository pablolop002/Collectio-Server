"use strict";

const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer();

// Router
const portal = express.Router();

// Login
portal.get("/login", upload.none(), function (request, response, next) {
  if (request.session && request.session.User) {
    response.redirect("/");
  } else {
    response.status(200);
    response.render("login", {error: null});
  }
});

// Redirect if not logged
portal.use(function (request, response, next) {
  if (request.session && request.session.User) {
    response.locals.User = request.session.User;
    next();
  } else {
    response.redirect("/");
  }
});

// Static user resources
portal.use('/profiles', express.static(path.join(__dirname, 'storage', 'profiles')));

portal.get('/logout', upload.none(), function (request, response, next) {
  request.session.destroy();
  response.redirect('/');
});

portal.get('/profile', upload.none(), function (request, response, next){

});

module.exports = portal;