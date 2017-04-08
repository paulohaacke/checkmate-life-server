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
            res.json(purpose);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

purposeRouter.route("/:purposeId")
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(purpose);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findOneAndUpdate({
                _id: req.params.purposeId,
                postedBy: req.decoded._id
            }, {
                $set: req.body
            }, {
                new: true
            },
            function(err, purpose) {
                if (err) next(err);
                res.json(purpose);
            });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.remove({ _id: req.params.purposeId, postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

purposeRouter.route('/:purposeId/values')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose && purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(purpose.values);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose && purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            purpose.values.push(req.body);
            var newPurposeId = purpose.values[purpose.values.length - 1]._id;
            purpose.save(function(err, purpose) {
                res.json(purpose.values.id(newPurposeId));
            })
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose && purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            purpose.values = [];
            purpose.save(function(err, purpose) {
                if (err) return next(err);
                res.json(purpose);
            })
        });
    });

purposeRouter.route('/:purposeId/values/:valueId')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose && purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(purpose.values.id(req.params.valueId));
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose && purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            purpose.values.id(req.params.valueId).remove();
            purpose.values.push(req.body);
            purpose.save(function(err, purpose) {
                if (err) return next(err);
                res.json(purpose);
            })
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findById(req.params.purposeId, function(err, purpose) {
            if (err) next(err);
            if (purpose && purpose.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            purpose.values.id(req.params.valueId).content = req.body.content;
            purpose.save(function(err, purpose) {
                if (err) return next(err);
                res.json(purpose);
            })
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Purpose.findOneAndUpdate({
            _id: req.params.purposeId,
            postedBy: req.decoded._id
        }, {
            $pull: { values: { _id: req.params.valueId } }
        }, {
            new: true
        }, function(err, purpose) {
            if (err) return next(err);
            res.json(purpose);
        });
    });

module.exports = purposeRouter;