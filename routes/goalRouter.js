var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Goal = require('../models/goal');
var Verify = require('./verify');

var goalRouter = express.Router();

module.exports = goalRouter;