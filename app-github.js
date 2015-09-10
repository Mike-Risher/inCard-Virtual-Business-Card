/*
127.0.0.1:3000/auth/linkedin/callback
source of strategy: https://github.com/auth0/passport-linkedin-oauth2
*/

var express = require('express');
var app = express();
var path = require('path');

// Express middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

// Passport
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;  // source of strategy: https://github.com/auth0/passport-linkedin-oauth2
var config = require('./config.json');
var pg = require('pg');
var http = require('http');
var request = require('request');
var dbOperations = require("./dbOperations.js");
var logFmt = require("logfmt");
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var config = require('./config.json');

// Logger
app.use(logger('dev'));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Middleware
app.use('/public',express.static(__dirname + '/public'));
//app.use(express.static('public')); // Put your static files here
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'shhhsupersecret' }));
app.use(passport.initialize());
app.use(passport.session());

// Logger
app.use(logger('dev'));


// heroku tells us to use this 
/*
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
*/

// Passport session setup.
// to support persistent login sessions, passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.  However, since this example does not
// have a database of user records, the complete LinkedIn profile is
// serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Middleware
app.use(express.static('public')); // Put your static files here
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'shhhsupersecret' }));

app.use(passport.initialize());
app.use(passport.session());
// Passport session setup.
// to support persistent login sessions, passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.  However, since this example does not
// have a database of user records, the complete LinkedIn profile is
// serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LinkedInStrategy({
  clientID: config.LINKED_IN_CLIENT_ID,  
  clientSecret: config.LINKED_IN_CLIENT_SECRET,
  callbackURL: "http://shrouded-reef-9087.herokuapp.com/auth/linkedin/callback",
  callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
  scope: [ 'r_basicprofile' ],
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect... 
  req.session.accessToken = accessToken;
  process.nextTick(function () {
    // To keep the example simple, the user's LinkedIn profile is returned to 
    // represent the logged-in user. In a typical application, you would want 
    // to associate the LinkedIn account with a user record in your database, 
    // and return that user instead. 
    done(null, profile);
  });
}));

// Routes
app.get('/', function (req, res) {
  res.render('index', {title: 'LinkedIn Authorization'});
});

/*
from http://www.jitendrazaa.com/blog/webtech/how-to-use-postgresql-in-nodejs/

app.get('/' , function(req,res) {
    res.sendfile('views/index.html');
} );
*/
app.get('/db/readRecords', function(req,res){
    dbOperations.getRecords(req,res);
});
app.get('/db/addRecord', function(req,res){
    dbOperations.addRecord(req,res);
});
app.get('/db/delRecord', function(req,res){
    dbOperations.delRecord(req,res);
});
app.get('/db/createTable', function(req,res){
    dbOperations.createTable(req,res);
});
app.get('/db/dropTable', function(req,res){
    dbOperations.dropTable(req,res);
}); 

app.get('/user', function(req, res) {
  // console.log('User Object: ', req.user);
  var name = req.user.displayName;
  var description = req.user._json.headline;
  var location = req.user._json.location.name;
  var company = req.user._json.positions.values[0].company.name;
  var jtitle = req.user._json.positions.values[0].title;
  var photo = req.user.photos[0];
  console.log('-----Desired data:  ',name,description,location,company,jtitle,photo);
  console.log('-----Desired data length:  ',name.length,description.length,location.length,company.length,jtitle.length,photo.length);
  res.render('user', {name: name, description: description, location: location, company: company, jtitle: jtitle, photo: photo, title: 'Your Business Card'});
	res.render('index', {title: 'LinkedIn Test Authorization'});
});

app.get('/user', function(req, res) {
  console.log('User Object: ', req.user);
  res.render('user', {user: req.user});
});

// This sends the user to authenticate with linked-in
app.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'asdfqwertlkjhz91xcv' }),
  function(req, res){
  // The request will be redirected to LinkedIn for authentication, so this 
  // function will not be called. 
});

// This is where we handle the callback and redirect the user
app.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/' }),
  function (req,res) {
    res.redirect('/user');
});

// The server
var server = app.listen(process.env.PORT || 3000, function () {
var server = app.listen(3000, "127.0.0.1", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('LinkedIn Test app listening at http://%s:%s', host, port);
});

