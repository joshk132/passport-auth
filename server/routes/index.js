// Middleware
var isUnauthenticated = require('../middleware/auth').isUnauthenticated,
    isAuthenticated = require('../middleware/auth').isAuthenticated;
    
// Models
var User    = require('../models/user'),
	Token   = require("../models/token");
	
// Controllers
var sessions = require('../controllers/sessions'),
	users = require('../controllers/users');

module.exports = function(app, passport) {

	// index page
	app.get('/', function(req, res) {
		req.flash('info', 'Flash is back!');
		res.locals.currentUser = req.user;
		res.render('index.ejs'); 
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs');
	});

	app.post('/user/login',
	isUnauthenticated,
	sessions.postLogin);

	app.get('/signup',
	function(req, res) {
		res.render('signup.ejs');
	});

	app.post('/user/signup', isUnauthenticated, sessions.postSignup);

	app.get('/profile', 
	isAuthenticated, 
	(req, res) => {
		res.render('profile');
	});

	app.get('/logout', 
	(req, res) => {
		req.logout();
		res.redirect('/');
	});
	
	app.get('/user/confirmation/:token/:email', 
	(req, res) => {
		res.locals.token = req.params.token;
    	res.locals.email = req.params.email;
    	res.render('confirmation');
	});
	
	app.post('/user/reset/:token', 
	(req, res) => {
		console.log(req.params.token);	
	});
	
	app.post('/user/confirmation', 
	isUnauthenticated, 
	users.confirmAccount);
	
	app.post('/user/delete', 
	isAuthenticated, 
	users.deleteAccount);

	app.post('/user/forgot', 
	users.postForgotPassword);
	
};
