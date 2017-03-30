var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var LifeArea = require('../models/lifearea');
var Verify = require('./verify');

var lifeAreaRouter = express.Router();

module.exports = lifeAreaRouter;