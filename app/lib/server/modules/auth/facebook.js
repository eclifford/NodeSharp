(function() {
  var Promise, UserManager, everyauth;
  everyauth = require('everyauth');
  Promise = everyauth.Promise;
  UserManager = require('../../models/userManager');
  everyauth.facebook.appId('152667908173664').appSecret('04b00a5d27cfc51facc606174c181e3c').findOrCreateUser(function(session, accessToken, accessTokExtra, fbUserMetadata) {
    var promise, userManager;
    promise = new Promise();
    userManager = UserManager.create();
    userManager.findOrCreateUserByFacebookData(fbUserMetadata, function(err, user) {
      return promise.fulfill(user);
    });
    return promise;
  }).redirectPath('/');
  everyauth.everymodule.findUserById(function(userId, callback) {
    var userManager;
    userManager = UserManager.create();
    return userManager.getById(userId, callback);
  });
}).call(this);
