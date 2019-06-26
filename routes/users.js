var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
let User = require('../models/user');
var passport = require('passport');

//registration form
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'registration' });
});

//registration process (registered user can't register again - feature needed)
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {errors:errors});
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err) {
          console.log(err);
        } else {
          newUser.password = hash;
          newUser.save(function(err){
            if(err) {
              console.log(err);
            } else {
              req.flash('successs', 'you are now registerd and can log in');
              res.redirect('/users/login');
            }
          });
        }
      });
    });
  }
});

//user login form
router.get('/login', function(req, res){
  res.render('login', { title: 'Login' });
});

//login process
router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'yor are logged out');
  res.redirect('/users/login');
});

module.exports = router;
