VideoManager    = require '../models/videoManager'

module.exports = (app) ->
  app.get "/videos.:format?", (req, res) ->
    videoManager = VideoManager.create()
    videoManager.get (err, videos) ->
      if req.params.format is 'json'
        res.json videos
      else
        res.render 'videos/index',
          title: 'Videos'
          videos: videos
  
  app.delete '/videos/:id', (req, res) ->
    videoManager = VideoManager.create()
    videoManager.delete req.param('id'), (err) ->
      res.json
        message: 'Video deleted'

  app.post '/videos/:id/addComment', (req, res) ->
    videoManager = VideoManager.create()
    user = req.user || null
    videoManager.addComment req.param('id'), user, req.body.comment, (err, video) ->
      res.json video
  
  app.post '/videos/:id/addVote', (req, res) ->
    videoManager = VideoManager.create()
    user = req.user || null
    videoManager.addVote req.param('id'), user, req.connection.remoteAddress, (err, video) ->
      res.json video


  app.get "/videos/new", (req, res) ->
    videoManager = VideoManager.create()
    res.render 'videos/new',
      title: 'New Video'
      post: req.body && req.body.video 

  app.post '/videos/new', (req, res) ->
    videoManager = VideoManager.create()
    videoManager.new req.body.video.title, req.body.video.videoId, req.body.video.description, (err, post) ->
      res.json({'response' : {'message': 'post was created'}})
      
        

