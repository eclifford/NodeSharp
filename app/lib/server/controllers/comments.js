(function() {
  var VideoManager;
  VideoManager = require('../models/videoManager');
  module.exports = function(app) {
    app.get("/comments/:videoId", function(req, res) {
      var videoManager;
      videoManager = VideoManager.create();
      return videoManager.getComments(req.param('videoId'), function(err, comments) {
        return res.json(comments);
      });
    });
    return app.post('/comments/:videoId', function(req, res) {
      var user, videoManager;
      videoManager = VideoManager.create();
      user = req.user || null;
      return videoManager.addComment(req.param('videoId'), user, req.body.comment, function(err, comment) {
        return res.json(comment);
      });
    });
  };
}).call(this);
