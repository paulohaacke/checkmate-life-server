var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var authenticate = require('./authenticate');
var config = require('./config');

var options = {
    mongos: {
        ssl: true,
        sslValidate: false,
    }
}

mongoose.connect(config.mongoUrl, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
    // we're connected!
    console.log("Connected correctly to server");
});

var index = require('./routes/index');
var users = require('./routes/users');
var purposeRouter = require('./routes/purposeRouter');
var contextRouter = require('./routes/contextRouter');
var lifeAreaRouter = require('./routes/lifeAreaRouter');
var goalRouter = require('./routes/goalRouter');
var taskRouter = require('./routes/taskRouter');

var app = express();

app.enable('trust proxy');

//Secure traffic only
app.all('*', function(req, res, next) {
    if (req.secure) {
        return next();
    }
    res.redirect('https://' + req.hostname + req.url);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//passport config
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/purpose', purposeRouter);
app.use('/contexts', contextRouter);
app.use('/lifeareas', lifeAreaRouter);
app.use('/goals', goalRouter);
app.use('/tasks', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;