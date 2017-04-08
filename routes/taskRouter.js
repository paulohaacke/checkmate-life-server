var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Task = require('../models/task');
var Verify = require('./verify');

var taskRouter = express.Router();

taskRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.query.postedBy = req.decoded._id;
        Task.find(req.query)
            .exec(function(err, task) {
                if (err) next(err);
                res.json(task);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.body.postedBy = req.decoded._id;
        Task.create(req.body, function(err, task) {
            if (err) return next(err);
            res.json(task);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Task.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

taskRouter.route("/:taskId")
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Task.findById(req.params.taskId, function(err, task) {
            if (err) next(err);
            if (task.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(task);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Task.findOneAndUpdate({
                _id: req.params.taskId,
                postedBy: req.decoded._id
            }, {
                $set: req.body
            }, {
                new: true
            },
            function(err, task) {
                if (err) next(err);
                res.json(task);
            });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Task.remove({ _id: req.params.taskId, postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = taskRouter;