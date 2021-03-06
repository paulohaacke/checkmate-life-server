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
            res.json(context)
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
            if (context.postedBy != req.decoded._id) {
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

contextRouter.route('/:ctxId/facts')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (context && context.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(context.facts);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (context && context.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            context.facts.push(req.body);
            var newFactId = context.facts[context.facts.length - 1]._id;
            context.save(function(err, context) {
                res.json(context.facts.id(newFactId));
            })
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (context && context.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            context.facts = [];
            context.save(function(err, context) {
                if (err) return next(err);
                res.json(context);
            })
        });
    });

contextRouter.route('/:ctxId/facts/:factId')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (context && context.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(context.facts.id(req.params.factId));
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (context && context.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            context.facts.id(req.params.factId).remove();
            context.facts.push(req.body);
            context.save(function(err, context) {
                if (err) return next(err);
                res.json(context);
            })
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findById(req.params.ctxId, function(err, context) {
            if (err) next(err);
            if (context && context.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            context.facts.id(req.params.factId).description = req.body.description;
            context.save(function(err, context) {
                if (err) return next(err);
                res.json(context);
            })
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Context.findOneAndUpdate({
            _id: req.params.ctxId,
            postedBy: req.decoded._id
        }, {
            $pull: { facts: { _id: req.params.factId } }
        }, {
            new: true
        }, function(err, context) {
            if (err) return next(err);
            res.json(context);
        });
    });

module.exports = contextRouter;