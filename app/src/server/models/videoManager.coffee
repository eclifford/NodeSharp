mongoose  			= require 'mongoose'
VideoSchema 		= require('./video').VideoSchema
UserSchema 			= require('./user').UserSchema
CommentSchema 	= require('./comment').CommentSchema
_ 							= require 'underscore'
Settings        = require 'settings'
path						= require 'path'
settings        = new Settings(path.join(__dirname, '../settings')).getEnvironment()

class VideoManager 
	constructor: ->
		mongoose.connect settings.db
		@Video = mongoose.model 'Video', VideoSchema
		@User = mongoose.model 'User', UserSchema
		@Comment = mongoose.model 'Comment', CommentSchema

	new: (title, videoId, description, callback) ->
		video = new @Video()
		video.title = title
		video.videoId = videoId
		video.description = description

		video.save (err) -> 
			throw err if err 
			mongoose.disconnect()
			callback err, video

	get: (callback) ->
		@Video
			.find({})
			.run (err, videos) ->
				throw err if err
				callback null, videos

	getComments: (id, callback) ->
		@Video
			.findById(id, (err, video) ->
				callback(null, video.comments)
			).populate('comments.user')

	addComment: (id, user, commentData, callback) ->
		@Video
			.findById(id, (err, video) ->
				comment = 
					user: user
					body: commentData.body
					dateCreated: Date.now()
					dateUpdated: Date.now()

				video.comments.push comment
				video.save (err) ->
					throw err if err
					callback null, comment
			).populate('comments.user') 
	
	addVote: (id, user, ip, callback) ->
		@Video.findById id, (err, video) ->
			vote = 
				user: user
				ip: ip
				dateCreated: Date.now()
			video.votes.push vote
			video.save (err) ->
				throw err if err
				mongoose.disconnect()
				callback null, video
	
	delete: (id, callback) ->
		@Video.findById id, (err, video) ->
			console.log 'id', id
			console.log 'removing', video
			video.remove (err) ->
				throw err if err
				callback err

module.exports.create = ->
	return new VideoManager()

