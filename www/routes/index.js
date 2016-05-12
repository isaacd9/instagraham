var path = require('path');
var express = require('express');
var urls = require('../urls.json');

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

    val["slug"] = slug;
    val["short"] = val.url.split('.')[0];
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

      res.send(val);
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

    res.send(val);
  });
});

module.exports = router;

