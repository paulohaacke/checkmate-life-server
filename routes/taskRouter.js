var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Task = require('../models/purpose');
var Verify = require('./verify');

var taskRouter = express.Router();

module.exports = taskRouter;