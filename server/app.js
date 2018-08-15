const   express = require("express"),
        app = express(),
        mongoose = require("mongoose"),
        session = require('express-session'),
        flash = require('express-flash'),
        RedisStore = require('connect-redis')(session),
        redis   = require("redis"),
        client  = redis.createClient(),
        bodyParser  = require("body-parser"),
        passport    = require("passport"),
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override"),
        logger = require('morgan'),
        path = require('path'),
        expressValidator = require('express-validator');
        
// Models
const User = require("./models/user");

// Configuration
const config = require("./config/config");
        
mongoose.connect(config.db, {autoReconnect: true}, (err) => {
    if (!err) console.log('MongoDB has connected successfully.');
});
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
// set session
app.use(session({
    secret: config.sessionSecret,
    // create new redis store.
    store: new RedisStore({ host: 'localhost', port: 6379, client: client, auto_reconnect: true}),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 1000 * 60 * 24 * 30 // 30 days
    },
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressValidator());


app.use(flash());



// PASSPORT CONFIGURATION
require('./controllers/passport')(passport);

//Set global res.locals
app.use(function(req, res, next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


// Dev setup
app.use(logger('dev'));



app.use(passport.initialize());
app.use(passport.session());

// Routes
var indexRoutes = require('./routes/index.js');

indexRoutes(app, passport);



module.exports = app;