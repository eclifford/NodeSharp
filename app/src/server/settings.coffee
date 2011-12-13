oneYear = 1000 * 60 * 60 * 24 * 365

exports.common =
  cookieMaxAge:     oneYear
  publicDir:        'public'
  cookieSecret:     'my.secret.phrase'
  viewEngine:       'jade'
  port:             '3000'

exports.development = 
  db:                     'mongodb://eclifford:reich33@staff.mongohq.com:10096/thevideowar'
  staticMaxAge:           null
  errorHandling:
    dumpExceptions:       true
    showStack:            true      
      
exports.production = 
  staticMaxAge:     oneYear
  errorHandling:    {}    

exports.test = {}