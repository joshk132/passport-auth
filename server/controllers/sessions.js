var passport = require('passport');


exports.postLogin = (req, res, next) => {
    passport.authenticate('login', {
		successRedirect : '/profile',
		failureRedirect : '/login', 
		failureFlash : true 
	})(req, res, next);
};

exports.postSignup = (req, res, next) => {
	passport.authenticate('signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
		failureFlash : true 
	})(req, res, next);
};