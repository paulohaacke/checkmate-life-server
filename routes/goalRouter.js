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

goalRouter.route("/:goalId")
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.findById(req.params.goalId, function(err, goal) {
            if (err) next(err);
            if (goal && goal.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(goal);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.findOneAndUpdate({
                _id: req.params.goalId,
                postedBy: req.decoded._id
            }, {
                $set: req.body
            }, {
                new: true
            },
            function(err, goal) {
                if (err) next(err);
                res.json(goal);
            });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.remove({ _id: req.params.goalId, postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

goalRouter.route('/:goalId/metrics')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.findById(req.params.goalId, function(err, goal) {
            if (err) next(err);
            if (goal && goal.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(goal.metrics);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.findById(req.params.goalId, function(err, goal) {
            if (err) next(err);
            if (goal && goal.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            req.body.postedBy = req.decoded._id;
            goal.metrics.push(req.body);
            goal.save(function(err, goal) {
                res.json(goal);
            })
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Goal.findById(req.params.goalId, function(err, goal) {
            if (err) next(err);
            if (goal && goal.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            goal.metrics = [];
            goal.save(function(err, goal) {
                if (err) return next(err);
                res.json(goal);
            })
        });
    });

module.exports = goalRouter;