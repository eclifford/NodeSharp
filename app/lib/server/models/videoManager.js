(function() {
  var CommentSchema, Settings, UserSchema, VideoManager, VideoSchema, mongoose, path, settings, _;

  mongoose = require('mongoose');

  VideoSchema = require('./video').VideoSchema;

  UserSchema = require('./user').UserSchema;

  CommentSchema = require('./comment').CommentSchema;

  _ = require('underscore');

  Settings = require('settings');

  path = require('path');

  settings = new Settings(path.join(__dirname, '../settings')).getEnvironment();

  VideoManager = (function() {

    function VideoManager() {
      mongoose.connect(settings.db);
      this.Video = mongoose.model('Video', VideoSchema);
      this.User = mongoose.model('User', UserSchema);
      this.Comment = mongoose.model('Comment', CommentSchema);
    }

    VideoManager.prototype["new"] = function(title, videoId, description, callback) {
      var video;
      video = new this.Video();
      video.title = title;
      video.videoId = videoId;
      video.description = description;
      return video.save(function(err) {
        if (err) throw err;
        mongoose.disconnect();
        return callback(err, video);
      });
    };

    VideoManager.prototype.get = function(callback) {
      return this.Video.find({}).run(function(err, videos) {
        if (err) throw err;
        return callback(null, videos);
      });
    };

    VideoManager.prototype.getComments = function(id, callback) {
      return this.Video.findById(id, function(err, video) {
        return callback(null, video.comments);
      }).populate('comments.user');
    };

    VideoManager.prototype.addComment = function(id, user, commentData, callback) {
      return this.Video.findById(id, function(err, video) {
        var comment;
        comment = {
          user: user,
          body: commentData.body,
          dateCreated: Date.now(),
          dateUpdated: Date.now()
        };
        video.comments.push(comment);
        return video.save(function(err) {
          if (err) throw err;
          return callback(null, comment);
        });
      }).populate('comments.user');
    };

    VideoManager.prototype.addVote = function(id, user, ip, callback) {
      return this.Video.findById(id, function(err, video) {
        var vote;
        vote = {
          user: user,
          ip: ip,
          dateCreated: Date.now()
        };
        video.votes.push(vote);
        return video.save(function(err) {
          if (err) throw err;
          mongoose.disconnect();
          return callback(null, video);
        });
      });
    };

    VideoManager.prototype["delete"] = function(id, callback) {
      return this.Video.findById(id, function(err, video) {
        console.log('id', id);
        console.log('removing', video);
        return video.remove(function(err) {
          if (err) throw err;
          return callback(err);
        });
      });
    };

    return VideoManager;

  })();

  module.exports.create = function() {
    return new VideoManager();
  };

}).call(this);
