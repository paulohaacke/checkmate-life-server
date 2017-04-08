var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

var Context = require('../models/context');
var LifeArea = require('../models/lifearea');
var Goal = require('../models/goal');
var Purpose = require('../models/purpose');
var Task = require('../models/task');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, function(req, res, next) {
    User.find({ _id: req.decoded._id }, function(err, users) {
        if (err) return next(err);
        res.json(users);
    })
});

router.delete('/', Verify.verifyOrdinaryUser, function(req, res, next) {
    Context.remove({ postedBy: req.decoded._id }, function(err, resp) {
        if (err) return next(err);
    });
    LifeArea.remove({ postedBy: req.decoded._id }, function(err, resp) {
        if (err) return next(err);
    });
    Goal.remove({ postedBy: req.decoded._id }, function(err, resp) {
        if (err) return next(err);
    });
    Purpose.remove({ postedBy: req.decoded._id }, function(err, resp) {
        if (err) return next(err);
    });
    Task.remove({ postedBy: req.decoded._id }, function(err, resp) {
        if (err) return next(err);
    });
    User.remove({ _id: req.decoded._id }, function(err, resp) {
        if (err) return next(err);
        return res.status(200).json({ status: 'User completly removed from database!' });
    });
})

router.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({ err: err });
        }

        if (req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
            user.lastname = req.body.lastname;
        }

        user.save(function(err, user) {
            passport.authenticate('local')(req, res, function() {
                var inititalContexts = [{
                        name: "Strengths",
                        facts: [],
                        color: "#827717",
                        "color-bg": "#e6ee9c",
                        postedBy: user._id
                    },
                    {
                        name: "Weaknessess",
                        facts: [],
                        color: "#b71c1c",
                        "color-bg": "#ef9a9a",
                        postedBy: user._id
                    },
                    {
                        name: "Opportunities",
                        facts: [],
                        color: "#1b5e20",
                        "color-bg": "#c5e1a5",
                        postedBy: user._id
                    },
                    {
                        name: "Obstacles",
                        facts: [],
                        color: "#4a148c",
                        "color-bg": "#b39ddb",
                        postedBy: user._id
                    }
                ]

                var initialLifeAreas = [{
                        label: "Family and Relationship",
                        color: "#827717",
                        "color-bg": "#e6ee9c",
                        postedBy: user._id
                    },
                    {
                        label: "Finances",
                        color: "#b71c1c",
                        "color-bg": "#ef9a9a",
                        postedBy: user._id
                    },
                    {
                        label: "Health Care",
                        color: "#1b5e20",
                        "color-bg": "#c5e1a5",
                        postedBy: user._id
                    },
                    {
                        label: "Personal Development",
                        color: "#4a148c",
                        "color-bg": "#b39ddb",
                        postedBy: user._id
                    }
                ]

                Context.create(inititalContexts, function(err) {
                    if (err) return next(err);
                });

                LifeArea.create(initialLifeAreas, function(err) {
                    if (err) return next(err);
                });

                return res.status(200).json({ status: 'Registration Successful!' });
            });
        });
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken({ "username": user.username, "_id": user._id, "admin": user.admin });

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/facebook', passport.authenticate('facebook'), function(req, res) {});

router.get('/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

module.exports = router;