module.exports = (path) ->
	express  = require 'express'
	app = module.exports = express.createServer()
	require("#{__dirname}/bootstrap").boot app, path

	app.listen(3000)
