fs          = require 'fs'
express     = require 'express'
everyauth   = require 'everyauth'
Settings    = require 'settings'
settings    = new Settings("#{__dirname}/settings").getEnvironment()
UserManager = require './models/userManager'
nap         = require 'nap'
facebook    = require './modules/auth/facebook'

module.exports = (path) ->
  app = module.exports = express.createServer()
  bootApplication(app, path)
  bootControllers(app)
  bootDepedencies(app)
  assetManager(app)

  app.listen(settings.port)
  
# App settings and middleware
bootApplication = (app, path) ->
  app.configure -> 
    app.set 'port', settings.port
    app.set 'views', "#{path}/app/src/server/views"
    app.set 'view engine', settings.viewEngine

    app.use express.errorHandler settings.errorHandling
    app.use express.static settings.publicDir, maxage: settings.staticMaxAge
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use express.cookieParser maxAge: settings.cookieMaxAge
    app.use express.session secret: settings.cookieSecret
    app.use everyauth.middleware()
    app.use express.logger()

    # Dynamic view helpers
    app.dynamicHelpers
      request: (req) ->
        req

      hasMessages: (req) ->
        return false  unless req.session
        Object.keys(req.session.flash or {}).length

      messages: (req) ->
        ->
          msgs = req.flash()
          Object.keys(msgs).reduce ((arr, type) ->
            arr.concat msgs[type]
          ), []

bootControllers = (app) ->
  fs.readdir __dirname + '/controllers', (err, files) ->
    throw err if err
    files.forEach (file) ->
      require("#{__dirname}/controllers/" + file) app

bootDepedencies = (app) ->
  everyauth.helpExpress(app)

assetManager = (app) ->
  assets = 
    js:
      preManipulate:
        '*': [nap.compileCoffeescript]
      postManipulate: 
        'production': [nap.uglifyJS]
      backbone: [
        'app/src/client/app.coffee'
        'app/src/client/models/**/*.coffee'
        'app/src/client/views/**/*.coffee'
        'app/src/client/controllers/**/*.coffee'
      ],
      postManipulate:
        'production': [nap.uglifyJS]
      vendor: [
        'public/javascripts/vendor/jquery-1.7.min.js'
        'public/javascripts/vendor/underscore.js'
        'public/javascripts/vendor/backbone.js'
        'public/javascripts/vendor/json2.js'
        'public/javascripts/vendor/jquery-tags/jquery.tagsinput.min.js'
      ]

    css:
      preManipulate:
        '*': [nap.compileStylus]
      postManipulate: 
        'production': [nap.yuiCssMin]
      all: [
        'public/stylesheets/stylus/**/*.styl'
      ],
      postManipulate: 
        'production': [nap.yuiCssMin]
      vendor: [
        'public/stylesheets/vendor/jquery-tags/jquery.tagsinput.css'
      ]   

    jst:
      preManipulate:
        '*': [nap.packageJST]
      postManipulate: 
        '*': [nap.prependJST("_.template")]

      templates: [
        'app/src/client/templates/**/*.html'
      ]
      
  app.configure "development", ->
    nap.watch assets, 'public/assets'


