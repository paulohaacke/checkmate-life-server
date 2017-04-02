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
            var id = lifeArea._id;
            res.writeHead(200, { 'Content-type': 'text/plain' });
            res.end('Added the lifeArea with id: ' + id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        LifeArea.remove({ postedBy: req.decoded._id }, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = lifeAreaRouter;