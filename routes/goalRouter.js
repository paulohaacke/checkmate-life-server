var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Goal = require('../models/goal');
var Verify = require('./verify');

var goalRouter = express.Router();

goalRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.query.postedBy = req.decoded._id;
        Goal.find(req.query)
            .exec(function(err, goal) {
                if (err) next(err);
                res.json(goal);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.body.postedBy = req.decoded._id;
        Goal.create(req.body, function(err, goal) {
            if (err) return next(err);
            var id = goal._id;
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('Added the goal with id: ' + id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = goalRouter;