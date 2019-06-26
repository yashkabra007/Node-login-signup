var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
let User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', ensureAuthenticated, function(req, res, next) {
 /*  req.flash('success','This is good');
  res.redirect('/'); */
  res.render('home', { title: 'Trello' });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
