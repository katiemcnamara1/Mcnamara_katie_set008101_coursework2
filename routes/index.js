var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Pug Tales' });
});

router.get('/posts', function(req, res, next) {
  res.render('../views/posts.jade');
});

module.exports = router;
