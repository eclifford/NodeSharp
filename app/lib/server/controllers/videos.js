(function() {
  var VideoManager;
  VideoManager = require('../models/videoManager');
  module.exports = function(app) {
    app.get("/videos.:format?", function(req, res) {
      var videoManager;
      videoManager = VideoManager.create();
      return videoManager.get(function(err, videos) {
        if (req.params.format === 'json') {
          return res.json(videos);
        } else {
          return res.render('videos/index', {
            title: 'Videos',
            videos: videos
          });
        }
      });
    });
    app["delete"]('/videos/:id', function(req, res) {
      var videoManager;
      videoManager = VideoManager.create();
      return videoManager["delete"](req.param('id'), function(err) {
        return res.json({
          message: 'Video deleted'
        });
      });
    });
    app.post('/videos/:id/addComment', function(req, res) {
      var user, videoManager;
      videoManager = VideoManager.create();
      user = req.user || null;
      return videoManager.addComment(req.param('id'), user, req.body.comment, function(err, video) {
        return res.json(video);
      });
    });
    app.post('/videos/:id/addVote', function(req, res) {
      var user, videoManager;
      videoManager = VideoManager.create();
      user = req.user || null;
      return videoManager.addVote(req.param('id'), user, req.connection.remoteAddress, function(err, video) {
        return res.json(video);
      });
    });
    app.get("/videos/new", function(req, res) {
      var videoManager;
      videoManager = VideoManager.create();
      return res.render('videos/new', {
        title: 'New Video',
        post: req.body && req.body.video
      });
    });
    return app.post('/videos/new', function(req, res) {
      var videoManager;
      videoManager = VideoManager.create();
      return videoManager["new"](req.body.video.title, req.body.video.videoId, req.body.video.description, function(err, post) {
        return res.json({
          'response': {
            'message': 'post was created'
          }
        });
      });
    });
  };
}).call(this);
