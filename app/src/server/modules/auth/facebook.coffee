everyauth    = require 'everyauth'
Promise      = everyauth.Promise
UserManager  = require '../../models/userManager'

everyauth.facebook
  .appId('152667908173664')
  .appSecret('04b00a5d27cfc51facc606174c181e3c')
  .findOrCreateUser (session, accessToken, accessTokExtra, fbUserMetadata) ->
    promise = new Promise();
    userManager = UserManager.create()
    userManager.findOrCreateUserByFacebookData(fbUserMetadata, (err, user) ->
      promise.fulfill(user)
    )
    return promise
  .redirectPath('/')

everyauth.everymodule.findUserById (userId, callback) ->
  userManager = UserManager.create()
  userManager.getById userId, callback
