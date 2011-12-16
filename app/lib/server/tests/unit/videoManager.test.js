(function() {
  var VideoManager, assert;

  VideoManager = require("../../models/videoManager");

  assert = require("assert");

  require("should");

  module.exports = {
    "is able to create video": function() {
      var videoManager;
      videoManager = VideoManager.create();
      return videoManager["new"]('Title', '1', 'DESCRIPTION', function() {
        return true;
      });
    }
  };

}).call(this);
