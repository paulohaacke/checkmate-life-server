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
            res.json(goal);
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
            Goal.update({
                dependencies: req.params.goalId,
                postedBy: req.decoded._id
            }, {
                $pull: { dependencies: req.params.goalId }
            }, {
                new: true,
                multi: true
            }, function(err, goal) {
                if (err) return next(err);
                res.json(goal);
            });
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
            var newMetricId = goal.metrics[goal.metrics.length - 1]._id;
            goal.save(function(err, goal) {
                res.json(goal.metrics.id(newMetricId));
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