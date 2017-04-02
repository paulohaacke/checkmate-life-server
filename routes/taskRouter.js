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
            var id = task._id;
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('Added the task with id: ' + id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Task.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = taskRouter;