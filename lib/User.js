var mongoose = require('mongoose');

var bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;


var userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String},
  postTitle: String,
  postDescr: String,
  date: {type: Date, default: Date.now}

});


 userSchema.pre('save', function (next){
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash){
        if(err) return next(err);

        user.password = hash;

        next();
      });
    });

 });

 userSchema.methods.comparePassword = function (candidatePass, callback){
   bcrypt.compare(candidatePass, this.password, function (err,isMatch){
     callback(undefined, isMatch);
   });
 };

var User = mongoose.model('myuser', userSchema);
module.exports = User;
