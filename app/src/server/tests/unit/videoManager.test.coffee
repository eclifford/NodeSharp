VideoManager = require("../../models/videoManager")
assert = require("assert")
require "should"

module.exports =
  "is able to create video": ->
    videoManager = VideoManager.create()
    videoManager.new('Title', '1', 'DESCRIPTION', ->
    	return true
    )

