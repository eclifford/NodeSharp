(function() {
  var Schema, VoteSchema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  VoteSchema = new Schema({
    ip: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    dateCreated: {
      type: Date,
      "default": Date.now()
    }
  });

  module.exports.VoteSchema = VoteSchema;

}).call(this);
