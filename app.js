"use strict";

// Set __basedir
global.__basedir = __dirname;

// Load Modules
const express = require("express");
const expressSession = require("express-session");
const fs = require("fs-extra");
const i18n = require("i18n");
const multer = require("multer");
const path = require("path");

// Config
const conf = require("./config/conf");
const database = require("./config/databases");
const passport = require("./config/auth");
const locales = require("./config/locales");
const upload = multer();

// Routers
const webAppRouter = require("./routes/webApp");
const apiRouter = require("./routes/api");

// ExpressJS Server creation
const app = express();

// ExpressJS Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static resources
app.use(express.static(path.join(__dirname, "public")));

// Lang Service
i18n.configure(locales.lang);
app.use(i18n.init);

// Express Session
app.use(
  expressSession({
    saveUninitialized: false,
    secret: conf.sessionSecret,
    resave: false,
    store: database.sessionStore,
  })
);

// Body Parser (Express)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Locals Session
app.use(function (request, response, next) {
  if (request.user) {
    response.locals.user = request.user;
  }

  response.locals.domain = conf.domain;

  next();
});

// Static pages
app.get("/", upload.none(), function (request, response) {
  response.render("pages/index", { current: "index" });
});

app.get("/about", upload.none(), function (request, response) {
  response.render("pages/about", { current: "about" });
});

app.get("/privacy-policy", upload.none(), function (request, response) {
  response.render("pages/privacy-policy", { current: "privacy" });
});

app.get("/terms", upload.none(), function (request, response) {
  response.render("pages/terms", { current: "terms" });
});

app.get("/legal-notice", upload.none(), function (request, response) {
  response.render("pages/legal-notice", { current: "legal" });
});

app.get("/cookies", upload.none(), function (request, response) {
  response.render("pages/cookies", { current: "cookies" });
});

// Routes
app.use("/api/v1", apiRouter);
app.use("/", webAppRouter);

// Error 404
app.use(function (request, response) {
  response.status(404);
  response.render("pages/error", { current: "error", errorCode: 404 });
});

// Error 500
app.use(function (error, request, response, next) {
  let file = path.join(
    __basedir,
    "storage",
    "logs",
    new Date().toString() + ".log"
  );
  let doc = error.message + "\n" + error.stack;

  fs.outputFileSync(file, doc);

  response.render("pages/error", {
    current: "error",
    errorCode: 500,
    file: file,
  });
});

module.exports = app;
