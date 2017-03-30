var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Purpose = require('../models/purpose');
var Verify = require('./verify');

var purposeRouter = express.Router();

module.exports = purposeRouter;