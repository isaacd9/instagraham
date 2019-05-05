
var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var winston = require('winston');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var quotes = require('./quotes.json');

var app = express();

winston.level = 'info';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use(function(req, res, next) {
  // Get keys
  req.keys = Object.keys(quotes);

  // Copy quotes into memory
  req.quotes = {};
  req.quotes = Object.assign(req.quotes, quotes);
  next();
});

app.use('/', express.static('static'));
app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  winston.log("Error", err.status);
  res.sendStatus(err.status || 500);
});

module.exports = app;

