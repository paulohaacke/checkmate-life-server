var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Context = require('../models/context');
var Verify = require('./verify');

var contextRouter = express.Router();

contextRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.query.postedBy = req.decoded._id;
        Context.find(req.query)
            .exec(function(err, context) {
                if (err) next(err);
                res.json(context);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.body.postedBy = req.decoded._id;
        Context.create(req.body, function(err, context) {
            if (err) return next(err);
            var id = context._id;
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('Added the context with id: ' + id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

contextRouter.route("/:ctxId")
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (dish.comments.id(req.params.ctxId).postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(context);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findOneAndUpdate({
                _id: req.params.ctxId,
                postedBy: req.decoded._id
            }, {
                $set: req.body
            }, {
                new: true
            },
            function(err, context) {
                if (err) next(err);
                res.json(context);
            });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.remove({ _id: req.params.ctxId, postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = contextRouter;