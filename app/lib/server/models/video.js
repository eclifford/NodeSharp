(function() {
  var CommentSchema, Schema, VideoSchema, VoteSchema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  CommentSchema = require('./comment').CommentSchema;

  VoteSchema = require('./vote').VoteSchema;

  VideoSchema = new Schema({
    title: String,
    videoId: String,
    comments: [CommentSchema],
    votes: [VoteSchema],
    dateCreated: {
      type: Date,
      "default": Date.now()
    },
    dateUpdated: {
      type: Date,
      "default": Date.now()
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  });

  module.exports.VideoSchema = VideoSchema;

}).call(this);
