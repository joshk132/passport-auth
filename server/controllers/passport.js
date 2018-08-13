// Packages needed
var LocalStrategy   = require('passport-local').Strategy;
var crypto = require('crypto');

// Models
var User    = require('../models/user');
var Token   = require("../models/token");

//custom functions
var sendEmail = require('../utils/sendEmail');

// expose this function to our app using module.exports
module.exports = function(passport) {


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    


passport.use('signup', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ email: req.body.email }, function(err, existingUser) {
          if(err){
            console.log(err);
          }
          if (existingUser) {
            req.flash('form', {
              email: req.body.email
            });
            return done(null, false, req.flash('error', 'An account with that email address already exists.'));
          }
          // edit this portion to accept other properties when creating a user.
          var user = new User({
            email: req.body.email,
            password: req.body.password // user schema pre save task hashes this password
          });

          user.save(function(err) {
            if (err) return done(err, false, req.flash('error', 'Error saving user.'));
            
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            token.save(function (err) {
            if (err) return done(null, false, req.flash('error', err.message));
            var email = req.body.email;
            // Send the email for the token
            var message = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user/confirmation\/' + token.token + '\/' + email + '\n';
            sendEmail('"Josh Kirby" noreply@joshakirby.com', user.email, 'Account Verification Token', message);
            });
            var time = 14 * 24 * 3600000;
            req.session.cookie.maxAge = time; //2 weeks
            req.session.cookie.expires = new Date(Date.now() + time);
            req.session.touch();
            return done(null, user, req.flash('success', 'A verification email has been sent to ' + user.email + '.'));
          });
        });

    })
  );



passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({ 'email' :  email },
        function(err, user) {
          if (err) return done(err);
          if (!user){
            return done(null, false, req.flash('error', 'User not found'));
          }
          user.comparePassword(password, function(err, isMatch) {
            if(err){
              done(err);
            }
            if (isMatch) {
              // Make sure the user has been verified
              if (!user.isVerified) return done (null, false, req.flash('error', 'Your account has not been verified.' ));
              var time = 14 * 24 * 3600000;
              req.session.cookie.maxAge = time; //2 weeks
              req.session.cookie.expires = new Date(Date.now() + time);
              req.session.touch();
              return done(null, user, req.flash('success', 'Successfully logged in.'));
            } else {
              return done(null, false, req.flash('error', 'Invalid Password'));
            }
            
          });
        }
      );
    })
  );












    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    // passport.use('login', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, email, password, done) { // callback with email and password from our form

    //     // find a user whose email is the same as the forms email
    //     // we are checking to see if the user trying to login already exists
    //     User.findOne({ 'email' :  email }, function(err, user) {
    //         // if there are any errors, return the error before anything else
    //         if (err)
    //             return done(err);

    //         // if no user is found, return the message
    //         if (!user)
    //             return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    //         // if the user is found but the password is wrong
    //         if (!user.validPassword(password))
    //             return done(null, false, req.flash('loginMessage', 'Sorry wrong password.')); // create the loginMessage and save it to session as flashdata

    //         // all is well, return successful user
    //         return done(null, user);
    //     });

    // }));

};