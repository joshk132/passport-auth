'use strict';
var User = require("../models/user"); 

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    res.locals.currentUser = req.user;
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect('/');
};

exports.isUnauthenticated = function(req, res, next) {
  if (!req.isAuthenticated()){
    return next();
  }
  
  res.redirect('/');
};