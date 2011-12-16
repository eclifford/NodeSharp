(function() {
  var Settings, UserManager, assets, bootApplication, bootControllers, bootDepedencies, everyauth, express, facebook, fs, nap, settings;
  fs = require('fs');
  express = require('express');
  everyauth = require('everyauth');
  Settings = require('settings');
  settings = new Settings("" + __dirname + "/settings").getEnvironment();
  UserManager = require('./models/userManager');
  nap = require('nap');
  facebook = require('./modules/auth/facebook');
  exports.boot = function(app, path) {
    bootApplication(app, path);
    bootControllers(app);
    return bootDepedencies(app);
  };
  assets = {
    js: {
      preManipulate: {
        '*': [nap.compileCoffeescript]
      },
      postManipulate: {
        'production': [nap.uglifyJS]
      },
      backbone: ['app/src/client/app.coffee', 'app/src/client/models/**/*.coffee', 'app/src/client/views/**/*.coffee', 'app/src/client/controllers/**/*.coffee'],
      postManipulate: {
        'production': [nap.uglifyJS]
      },
      vendor: ['public/javascripts/vendor/jquery-1.7.min.js', 'public/javascripts/vendor/underscore.js', 'public/javascripts/vendor/backbone.js', 'public/javascripts/vendor/json2.js', 'public/javascripts/vendor/jquery-tags/jquery.tagsinput.min.js']
    },
    css: {
      preManipulate: {
        '*': [nap.compileStylus]
      },
      postManipulate: {
        'production': [nap.yuiCssMin]
      },
      all: ['public/stylesheets/stylus/**/*.styl'],
      postManipulate: {
        'production': [nap.yuiCssMin]
      },
      vendor: ['public/stylesheets/vendor/jquery-tags/jquery.tagsinput.css']
    }
  };
  bootApplication = function(app, path) {
    app.configure(function() {
      app.set('port', settings.port);
      app.set('views', "" + path + "/app/src/server/views");
      app.set('view engine', settings.viewEngine);
      app.use(express.errorHandler(settings.errorHandling));
      app.use(express.static(settings.publicDir, {
        maxage: settings.staticMaxAge
      }));
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
      return app.dynamicHelpers({
        request: function(req) {
          return req;
        },
        hasMessages: function(req) {
          if (!req.session) {
            return false;
          }
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
    return app.configure("development", function() {
      return nap.package(assets, 'public/assets');
    });
  };
  bootControllers = function(app) {
    return fs.readdir(__dirname + '/controllers', function(err, files) {
      if (err) {
        throw err;
      }
      return files.forEach(function(file) {
        return require(("" + __dirname + "/controllers/") + file)(app);
      });
    });
  };
  bootDepedencies = function(app) {
    return everyauth.helpExpress(app);
  };
}).call(this);
