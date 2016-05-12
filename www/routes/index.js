var path = require('path');
var express = require('express');

var router = express.Router();

/* GET home page. */

var getEssay = function(redis, slug, next) {
  redis.hgetall(slug, function(err, val) {
    if (err) {
      next(err);
      return;
    }

    if (!val) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
      return;
    }

    val["short"] = val.url.split('.')[0];
    val["url"] = "http://paulgraham.com/" + val.url;
    val["slug"] = slug;
    next(err, val);
  });
}

router.get('/', function(req, res, next) {
  var redis = req.redis;

  redis.randomkey(function(err, key) {
    if (err) {
      next(err);
      return;
    }

    var slug = key;
    getEssay(redis, slug, function(err, val) {
      if (err) {
        next(err);
        return;
      }

      res.type('application/json');
      res.status(200).send(val);
    });
  });
});

router.get('/:slug', function(req, res, next) {
  var redis = req.redis;
  var slug = req.params.slug;

  getEssay(redis, slug, function(err, val) {
    if (err) {
      next(err);
      return;
    }

    res.type('application/json');
    res.status(200).send(val);
  });
});

module.exports = router;

