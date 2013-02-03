// Generated by IcedCoffeeScript 1.4.0b
(function() {
  var FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FacebookStrategy, allowedFriends, app, ejs, everyone, express, hostname, http, httpserver, nowjs, passport, userList, userStatus;

  express = require('express');

  app = express();

  http = require('http');

  httpserver = http.createServer(app);

  httpserver.listen(5678);

  nowjs = require('now');

  everyone = nowjs.initialize(httpserver);

  passport = require('passport');

  FacebookStrategy = require('passport-facebook').Strategy;

  FACEBOOK_APP_ID = '123681104472943';

  FACEBOOK_APP_SECRET = '9115798d61b57d41b5e10b66f49e86a0';

  hostname = require('os').hostname();

  if (hostname === 'psetparty') {
    FACEBOOK_APP_ID = '464385110294754';
    FACEBOOK_APP_SECRET = '0a31a7644246d7681bd2ef874a6bf0e7';
  }

  passport.serializeUser(function(user, done) {
    return done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    return done(null, obj);
  });

  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  }, function(accessToken, refreshToken, profile, done) {
    return process.nextTick(function() {
      return done(null, profile);
    });
  }));

  ejs = require('ejs');

  ejs.open = '{{';

  ejs.close = '}}';

  app.configure('development', function() {
    return app.use(express.errorHandler());
  });

  app.configure(function() {
    app.set('views', __dirname + '/');
    app.set('view engine', 'ejs');
    app.engine('html', ejs.renderFile);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('view options', {
      layout: false
    });
    app.locals({
      layout: false
    });
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
      secret: 'keyboard cat'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    return app.use(express["static"](__dirname + '/'));
  });

  app.get('/invitetopillow', function(req, res) {
    return res.render('invitetopillow.html', {
      'app_id': FACEBOOK_APP_ID
    });
  });

  app.get('/accesspillow', function(req, res) {
    return res.render('accesspillow.html', {
      'app_id': FACEBOOK_APP_ID
    });
  });

  app.get('/', function(req, res) {
    return res.render('index.html', {
      'app_id': FACEBOOK_APP_ID
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {});

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login.html'
  }), function(req, res) {
    return res.redirect('/');
  });

  userStatus = {};

  userList = {};

  everyone.now.getStatus = function(username, callback) {
    if (userStatus[username] == null) userStatus[username] = 'asleep';
    if (callback != null) return callback(userStatus[username]);
  };

  everyone.now.setStatus = function(username, newstatus, callback) {
    userStatus[username] = newstatus;
    if (callback != null) callback(newstatus);
    return everyone.now.refreshStatus(username, newstatus);
  };

  allowedFriends = {};

  everyone.now.setFriendsAllowed = function(userid, allowedFriendList) {
    return allowedFriends[userid] = allowedFriendList;
  };

  everyone.now.getFriendsAllowed = function(userid, callback) {
    return callback(allowedFriends[userid]);
  };

  app.get('/allowedfriends', function(req, res) {
    var userid;
    userid = req.query.userid;
    return res.end(JSON.stringify(allowedFriends[userid]));
  });

  app.get('/playsound', function(req, res) {
    var soundfile, userid;
    userid = req.query.userid;
    soundfile = req.query.soundfile;
    everyone.now.playSound(userid, soundfile);
    return res.end('send sound');
  });

}).call(this);
