var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var LifeArea = require('../models/lifearea');
var Verify = require('./verify');

var lifeAreaRouter = express.Router();

lifeAreaRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.query.postedBy = req.decoded._id;
        LifeArea.find(req.query)
            .exec(function(err, lifeArea) {
                if (err) next(err);
                res.json(lifeArea);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        req.body.postedBy = req.decoded._id;
        LifeArea.create(req.body, function(err, lifeArea) {
            if (err) return next(err);
            res.json(lifeArea);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        LifeArea.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

lifeAreaRouter.route("/:lifeAreaId")
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        LifeArea.findById(req.params.lifeAreaId, function(err, lifeArea) {
            if (err) next(err);
            if (lifeArea && lifeArea.postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            res.json(lifeArea);
        });
    })
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        LifeArea.findOneAndUpdate({
                _id: req.params.lifeAreaId,
                postedBy: req.decoded._id
            }, {
                $set: req.body
            }, {
                new: true
            },
            function(err, lifeArea) {
                if (err) next(err);
                res.json(lifeArea);
            });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        LifeArea.remove({ _id: req.params.lifeAreaId, postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = lifeAreaRouter;