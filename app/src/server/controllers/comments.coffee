VideoManager    = require '../models/videoManager'

module.exports = (app) ->
  app.get "/comments/:videoId", (req, res) ->
    videoManager = VideoManager.create()
    videoManager.getComments req.param('videoId'), (err, comments) ->
      res.json comments

  app.post '/comments/:videoId', (req, res) ->
    videoManager = VideoManager.create()
    user = req.user || null
    videoManager.addComment req.param('videoId'), user, req.body.comment, (err, comment) ->
      res.json comment