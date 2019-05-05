var path = require('path');
var express = require('express');

var router = express.Router();

/* GET home page. */

var makeResponse = function(quotes, key) {
  var val = quotes[key];

  val["short"] = val.url.split('.')[0];
  val["url"] = "http://paulgraham.com/" + val.url;
  val["id"] = key;
  val["slug"] = key;

  return val
}

router.get('/', function(req, res, next) {
  var redis = req.redis;

  var key = req.keys[
    Math.floor(Math.random(req.keys.length - 1) * req.keys.length)
  ]

  var body = makeResponse(req.quotes, key);

  if (!body) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    return;
  }

  res.type('application/json');
  res.status(200).send(body);
});

router.get('/:slug', function(req, res, next) {
  var slug = req.params.slug;

  var body = makeResponse(req.quotes, slug);
  if (!body) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    return;
  }

  res.type('application/json');
  res.status(200).send(body);
});

module.exports = router;

