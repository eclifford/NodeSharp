(function() {
  var Settings, UserManager, bootApplication, bootControllers, bootDepedencies, cluster, everyauth, express, facebook, fs, nap, path, settings, stylus;

  fs = require('fs');

  express = require('express');

  cluster = require('cluster');

  everyauth = require('everyauth');

  Settings = require('settings');

  settings = new Settings("" + __dirname + "/settings").getEnvironment();

  UserManager = require('./models/userManager');

  nap = require('nap');

  facebook = require('./modules/auth/facebook');

  stylus = require('stylus');

  path = require('path');

  module.exports = function(path) {
    var app;
    app = module.exports = express.createServer();
    bootApplication(app, path);
    bootControllers(app);
    bootDepedencies(app);
    return app.listen(settings.port);
  };

  bootApplication = function(app, path) {
    return app.configure(function() {
      app.set('port', settings.port);
      app.set('views', "" + path + "/app/src/server/views");
      app.set('view engine', settings.viewEngine);
      app.use(express.errorHandler(settings.errorHandling));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.cookieParser({
        maxAge: settings.cookieMaxAge
      }));
      app.use(express.session({
        secret: settings.cookieSecret
      }));
      app.use(everyauth.middleware());
      app.use(express.logger());
      app.use(stylus.middleware({
        src: require('path').join(__dirname, '../../public/stylesheets/stylus'),
        dest: require('path').join(__dirname, '../../public/stylesheets'),
        debug: true
      }));
      app.use(express.static(settings.publicDir, {
        maxage: settings.staticMaxAge
      }));
      return app.dynamicHelpers({
        request: function(req) {
          return req;
        },
        hasMessages: function(req) {
          if (!req.session) return false;
          return Object.keys(req.session.flash || {}).length;
        },
        messages: function(req) {
          return function() {
            var msgs;
            msgs = req.flash();
            return Object.keys(msgs).reduce((function(arr, type) {
              return arr.concat(msgs[type]);
            }), []);
          };
        }
      });
    });
  };

  bootControllers = function(app) {
    return fs.readdir(__dirname + '/controllers', function(err, files) {
      if (err) throw err;
      return files.forEach(function(file) {
        return require(("" + __dirname + "/controllers/") + file)(app);
      });
    });
  };

  bootDepedencies = function(app) {
    return everyauth.helpExpress(app);
  };

}).call(this);
