"use strict";

// Load modules
const express = require('express');
const multer = require("multer");

// Config
const profiles = multer({dest: '../../storage/profiles'});