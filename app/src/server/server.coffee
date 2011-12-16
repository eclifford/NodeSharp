fs          = require 'fs'
express     = require 'express'
cluster     = require 'cluster'
everyauth   = require 'everyauth'
Settings    = require 'settings'
settings    = new Settings("#{__dirname}/settings").getEnvironment()
UserManager = require './models/userManager'
nap         = require 'nap'  
facebook    = require './modules/auth/facebook'
stylus      = require 'stylus'
path        = require 'path'


module.exports = (path) ->
  app = module.exports = express.createServer()
  bootApplication(app, path) 
  bootControllers(app)
  bootDepedencies(app)

  #app.listen(settings.port)
  cluster(app)
   .set('workers', 1)
   .use(cluster.logger('logs', 'debug'))
   .use(cluster.debug())
   .listen(3000)
 # app.listen(3000)
  # cluster(app) 
  #   .set('working directory', '/')
  #   .in('development')
  #     .set('workers', 1)
  #     .use(cluster.logger('logs', 'debug'))
  #     .use(cluster.debug())
  #   .in('production')
  #     .set('workers', 4)
  #     .use(cluster.logger())
  #     .use(cluster.pidfiles())
  #   .in('all')
  #     .listen(settings.port)
  
  
# App settings and middleware
bootApplication = (app, path) ->
  app.configure -> 
    app.set 'port', settings.port
    app.set 'views', "#{path}/app/src/server/views"
    app.set 'view engine', settings.viewEngine

    app.use express.errorHandler settings.errorHandling
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use express.cookieParser maxAge: settings.cookieMaxAge
    app.use express.session secret: settings.cookieSecret
    app.use everyauth.middleware()
    app.use express.logger()
    app.use express.static settings.publicDir, maxage: settings.staticMaxAge

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


