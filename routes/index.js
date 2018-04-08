var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../lib/User');
mongoose.connect('mongodb://localhost/test');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Pug Tales' });
});

router.get('/posts', function(req, res, next) {
  res.render('posts');
});

router.get('/feed', function(req, res, next) {
  res.render('../views/feed');
});

router.get('/login', function(req, res, next) {
  res.render('../views/login');
});

router.post('/', function(req,res){
  var username = JSON.stringify(req.body.nameBox);
  var password = JSON.stringify(req.body.passwordBox);

  console.log(username);
  console.log(password);



  var newuser = new User();
  newuser.username = username;
  newuser.password = password;


  newuser.save(function(err, savedUser){
    if(err){
      console.log(err);
      return res.status(500).send();
    }

    return res.render('../views/posts.jade');
  })

})




router.post('/login', function(req,res){

  var username = JSON.stringify(req.body.nameBox2);
  var password = JSON.stringify(req.body.passwordBox2);


  User.findOne({username: username}, function(err, user){
    if(err){
      console.log(err)
      return res.status(500).send();
    }

    if(!user){
      res.redirect('../views/index.jade');
    }

    user.comparePassword(password, function(err, isMatch){
      if(isMatch && isMatch == true){
        req.session.user = user;
        return res.render('../views/posts.jade');
      }else{
        return res.render('../views/posts.jade');
      }
    });

  });

});


router.post('/posts', function(req,res){
  var postTitle = JSON.stringify(req.body.postTitle);
  var postDescr = JSON.stringify(req.body.postDescr);
  console.log(postTitle);
  console.log(postDescr);
  var dateTime = new Date();
  console.log(req.session.user.username);
  var username = req.session.user.username;

  User.findOne({username: username}, function(err, found){
    if(err){
      console.log(err)
       res.status(500).send();
    }else{
      if(!found){
        res.status(404).send();

    }else{
      if(req.body.username){
        found.username=req.body.username;
      }
      if(req.body.password){
        found.password=req.body.password;
      }
      found.postTitle=postTitle;
      found.postDescr=postDescr;
      found.date= dateTime;

    found.save(function(err, added){
      if(err){
        console.log(err)
        return res.status(500).send();
      }
      else{
        var title = found.postTitle;
        var descr = found.postDescr;
        var time = found.date;

        res.render('../views/blocks.jade', {titleNew: postTitle, descrNew: postDescr, dateNew:time});
      }
      })
      }

    }

  })

})



module.exports = router;
