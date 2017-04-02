var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Purpose = require('../models/purpose');
var Verify = require('./verify');

var purposeRouter = express.Router();

purposeRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.query.postedBy = req.decoded._id;
        Purpose.find(req.query)
            .exec(function(err, purpose) {
                if (err) next(err);
                res.json(purpose);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.body.postedBy = req.decoded._id;
        Purpose.create(req.body, function(err, purpose) {
            if (err) return next(err);
            var id = purpose._id;
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('Added the purpose with id: ' + id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = purposeRouter;