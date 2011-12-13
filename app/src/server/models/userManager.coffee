mongoose      = require 'mongoose'
everyauth     = require 'everyauth'
Promise       = everyauth.Promise
UserSchema    = require('./user').UserSchema
Settings      = require 'settings'
path					= require 'path'
settings      = new Settings(path.join(__dirname, '../settings')).getEnvironment()

class UserManager 
	constructor: ->
		mongoose.connect settings.db
		@User = mongoose.model 'User', UserSchema
	
	newUser: (name, email) ->
		user = new @User()
		user.name = name
		user.email = email
		user.dateCreated = Date.now()
		user.dateUpdated = Date.now()
		user.save (err) ->
			throw err if err
			mongoose.disconnect()
	
	newUser: (name, email, password, facebookId, facebookToken, role, callback) ->
		user = new @User()
		user.name = name 
		user.email = email ? ''
		user.password = password ? ''
		user.facebookId = facebookId ? ''
		user.facebookToken = facebookToken ? ''
		user.role = role ? 'user'

		user.save (err) ->
			throw err if err
			mongoose.disconnect()
			callback null, user
	
	findOrCreateUserByFacebookData: (facebookData, callback) ->
		query = @User.findOne({facebookId: facebookData.id})
		query.exec (err, user) =>
			throw err if err
			if user? 	
				callback null, user			 
			else 
				@newUser facebookData.name, '', '', facebookData.id, '', 'user', (err, user) ->
					callback null, user
	
	getById: (id, callback) ->
		query = @User.findById(id, (err, user) ->
			callback null, user
		) 
			
module.exports.create = ->
	return new UserManager()

